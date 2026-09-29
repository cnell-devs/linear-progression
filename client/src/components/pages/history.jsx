/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../nav";
import { api } from "../../utils/api";
import { useWeightUnit } from "../../hooks/useWeightUnit";
import { convertUtcToDateFormat } from "../../utils/date-formatter";
import {
  groupSetsByWorkout,
  averageWeight,
  formatWeight,
  formatDuration,
} from "../../utils/workout-display";

const PAGE_SIZE = 20;

// A finished workout, summarised the way you'd want to read it later: what you
// did, per exercise, with the best set called out.
const SessionCard = ({ session, onDelete, unit }) => {
  const groups = groupSetsByWorkout(session.sets);
  const completedSets = session.sets.filter(
    (s) => s.completed && !s.isWarmup
  ).length;

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate font-bold">
              {session.name || session.template?.name || "Workout"}
            </h2>
            <div className="text-xs opacity-60">
              {convertUtcToDateFormat(session.date)}
            </div>
          </div>
          <div className="dropdown dropdown-end flex-none">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost btn-square"
              aria-label="Workout options"
            >
              <span className="material-icons">more_vert</span>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-20 w-40 rounded-box border bg-base-100 p-2 shadow"
            >
              <li>
                <button
                  className="text-error"
                  onClick={() => onDelete(session.id)}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 text-xs opacity-70">
          <span className="flex items-center gap-1">
            <span className="material-icons text-sm">schedule</span>
            {formatDuration(session.startedAt, session.finishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-icons text-sm">repeat</span>
            {completedSets} sets
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {groups.map((group) => {
            const working = group.sets.filter((s) => s.completed && !s.isWarmup);
            if (!working.length) return null;
            // Per-exercise average. A session-wide figure would blend squats
            // with lateral raises and mean nothing.
            return (
              <div
                key={group.userWorkoutId}
                className="flex items-baseline justify-between gap-2 text-sm"
              >
                <span className="truncate">
                  <span className="opacity-50">{working.length}× </span>
                  {group.name}
                </span>
                <span className="flex-none font-mono text-xs opacity-70">
                  {formatWeight(averageWeight(group.sets), unit)} avg
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export function History() {
  const unit = useWeightUnit();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (skip = 0) => {
    try {
      const data = await api(`/sessions?take=${PAGE_SIZE}&skip=${skip}`);
      setHasMore(data.length === PAGE_SIZE);
      setSessions((prev) => (skip === 0 ? data : [...prev, ...data]));
      setError(null);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load(0).finally(() => setLoading(false));
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await api(`/sessions/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert("Could not delete workout: " + err.message);
    }
  };

  const finished = sessions.filter((s) => s.finishedAt);

  return (
    <>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <h1 className="mb-4 text-2xl font-bold">History</h1>

        {loading && (
          <div className="py-12 text-center opacity-60">Loading...</div>
        )}

        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && finished.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="mb-4 text-sm opacity-60">
              No finished workouts yet.
            </p>
            <Link to="/workout" className="btn btn-primary btn-sm">
              Start your first workout
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {finished.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={handleDelete}
              unit={unit}
            />
          ))}
        </div>

        {hasMore && finished.length > 0 && (
          <button
            className="btn btn-ghost mt-4 w-full"
            disabled={loadingMore}
            onClick={async () => {
              setLoadingMore(true);
              await load(sessions.length);
              setLoadingMore(false);
            }}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </>
  );
}
