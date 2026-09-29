import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import { useAuth } from "../components/auth/authContext";

// Owns the in-progress workout. Every mutation updates local state from the
// server's response so the logger screen never has to refetch the whole
// session just to show a set the user typed a second ago.
export function useSession() {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActive = useCallback(async () => {
    if (!user) {
      setSession(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setSession(await api("/sessions/active"));
      setError(null);
    } catch (err) {
      console.error("Failed to load active session:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadActive();
  }, [loadActive]);

  const startSession = useCallback(async ({ templateId, name } = {}) => {
    const created = await api("/sessions", {
      method: "POST",
      body: { templateId, name },
    });
    setSession(created);
    return created;
  }, []);

  const addSet = useCallback(
    async (sessionId, setData) => {
      const created = await api(`/sessions/${sessionId}/sets`, {
        method: "POST",
        body: setData,
      });
      setSession((prev) =>
        prev && prev.id === sessionId
          ? { ...prev, sets: [...prev.sets, created] }
          : prev
      );
      return created;
    },
    []
  );

  const updateSet = useCallback(async (setId, patch) => {
    const updated = await api(`/sessions/sets/${setId}`, {
      method: "PATCH",
      body: patch,
    });
    setSession((prev) =>
      prev
        ? {
            ...prev,
            sets: prev.sets.map((s) => (s.id === setId ? updated : s)),
          }
        : prev
    );
    return updated;
  }, []);

  const deleteSet = useCallback(async (setId) => {
    await api(`/sessions/sets/${setId}`, { method: "DELETE" });
    setSession((prev) =>
      prev ? { ...prev, sets: prev.sets.filter((s) => s.id !== setId) } : prev
    );
  }, []);

  const finishSession = useCallback(async (sessionId, { notes, name } = {}) => {
    const finished = await api(`/sessions/${sessionId}`, {
      method: "PATCH",
      body: { finished: true, notes, name },
    });
    setSession(null);
    return finished;
  }, []);

  const discardSession = useCallback(async (sessionId) => {
    await api(`/sessions/${sessionId}`, { method: "DELETE" });
    setSession(null);
  }, []);

  return {
    session,
    loading,
    error,
    reload: loadActive,
    startSession,
    addSet,
    updateSet,
    deleteSet,
    finishSession,
    discardSession,
  };
}
