import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../utils/api";
import { useAuth } from "../components/auth/authContext";
import {
  readSession,
  writeSession,
  markDirty,
  isDirty,
  createLocalSession,
  createLocalSet,
  mergeServerSession,
} from "../utils/localSession";

const SYNC_DEBOUNCE_MS = 1500;

// Owns the in-progress workout, local-first.
//
// Every mutation updates React state and localStorage synchronously, then
// schedules a background sync. Nothing the user does depends on the network,
// so logging works with no signal and the workout survives a reload, a locked
// phone, or a closed tab. The server converges on the device's copy via an
// idempotent whole-session upsert.
export function useSession() {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(isDirty());
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  const timer = useRef(null);
  const latest = useRef(null);

  // Persist and schedule a sync. Writing to localStorage first means a crash
  // between here and the network call still leaves the workout intact.
  const commit = useCallback((next) => {
    latest.current = next;
    setSession(next);
    writeSession(next);
    if (next) {
      markDirty(true);
      setPending(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => flush(), SYNC_DEBOUNCE_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flush = useCallback(async () => {
    const current = latest.current;
    if (!current || !navigator.onLine) return;
    try {
      const saved = await api("/sessions/sync", {
        method: "PUT",
        body: current,
      });
      // Re-read: the user may have logged more while the request was in
      // flight, and their copy is the authority.
      const merged = mergeServerSession(latest.current || current, saved);
      latest.current = merged;
      setSession(merged);
      writeSession(merged);
      markDirty(false);
      setPending(false);
      setError(null);
    } catch (err) {
      // Stay dirty and try again on the next change or reconnect. A failed
      // sync must never surface as a failed set.
      console.warn("Session sync deferred:", err.message);
      setPending(true);
    }
  }, []);

  // Adopt whatever is on the device, falling back to the server's active
  // session when this device has nothing (e.g. a fresh browser).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setSession(null);
        setLoading(false);
        return;
      }
      const local = readSession();
      if (local) {
        latest.current = local;
        setSession(local);
        setLoading(false);
        if (isDirty()) flush();
        return;
      }
      try {
        const remote = await api("/sessions/active");
        if (cancelled) return;
        if (remote) {
          // Give server rows client ids so later edits sync by the same key.
          const adopted = {
            ...remote,
            clientId: remote.clientId || createLocalSession().clientId,
            sets: (remote.sets || []).map((s) => ({
              ...s,
              clientId: s.clientId || createLocalSet(s).clientId,
            })),
          };
          latest.current = adopted;
          setSession(adopted);
          writeSession(adopted);
        }
      } catch (err) {
        // Offline with no local session simply means no active workout.
        console.warn("Could not load active session:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, flush]);

  // Retry as soon as connectivity returns.
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      if (isDirty()) flush();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [flush]);

  const startSession = useCallback(
    async ({ templateId, name } = {}) => {
      const created = createLocalSession({ templateId, name });
      commit(created);
      return created;
    },
    [commit]
  );

  const addSet = useCallback(
    async (_sessionId, data) => {
      const set = createLocalSet(data);
      const current = latest.current;
      if (!current) return set;
      commit({ ...current, sets: [...current.sets, set] });
      return set;
    },
    [commit]
  );

  const updateSet = useCallback(
    async (clientId, patch) => {
      const current = latest.current;
      if (!current) return;
      commit({
        ...current,
        sets: current.sets.map((s) =>
          s.clientId === clientId ? { ...s, ...patch } : s
        ),
      });
    },
    [commit]
  );

  const deleteSet = useCallback(
    async (clientId) => {
      const current = latest.current;
      if (!current) return;
      commit({
        ...current,
        sets: current.sets.filter((s) => s.clientId !== clientId),
      });
    },
    [commit]
  );

  const finishSession = useCallback(async () => {
    const current = latest.current;
    if (!current) return;
    const finished = { ...current, finishedAt: new Date().toISOString() };
    latest.current = finished;
    writeSession(finished);
    clearTimeout(timer.current);

    try {
      await api("/sessions/sync", { method: "PUT", body: finished });
      markDirty(false);
      setPending(false);
    } catch (err) {
      // Finishing offline is fine: the record stays on the device and syncs
      // on reconnect. Surfaced so the UI can say so.
      console.warn("Finish will sync when back online:", err.message);
      setPending(true);
    }
    latest.current = null;
    writeSession(null);
    setSession(null);
  }, []);

  const discardSession = useCallback(async () => {
    const current = latest.current;
    clearTimeout(timer.current);
    latest.current = null;
    writeSession(null);
    setSession(null);
    setPending(false);
    // Only the server needs telling if it ever knew about this session.
    if (current?.id) {
      try {
        await api(`/sessions/${current.id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Could not delete remote session:", err.message);
      }
    }
  }, []);

  return {
    session,
    loading,
    error,
    online,
    pending,
    reload: flush,
    startSession,
    addSet,
    updateSet,
    deleteSet,
    finishSession,
    discardSession,
  };
}
