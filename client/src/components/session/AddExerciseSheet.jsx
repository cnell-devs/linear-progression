/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { workoutName } from "../../utils/workout-display";

// Bottom sheet for picking an exercise to add mid-session. Slides up from the
// bottom so it stays inside thumb reach on a phone.
export const AddExerciseSheet = ({ open, onClose, onSelect, excludeIds }) => {
  const { workouts, isLoading, createUserWorkout } = useUserWorkouts();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const list = (workouts || []).filter(
      (w) => !excludeIds.includes(w.id)
    );
    if (!query.trim()) return list;
    const needle = query.toLowerCase();
    return list.filter((w) => workoutName(w).toLowerCase().includes(needle));
  }, [workouts, query, excludeIds]);

  const exactMatch = (workouts || []).some(
    (w) => workoutName(w).toLowerCase() === query.trim().toLowerCase()
  );

  const createAndSelect = async () => {
    setCreating(true);
    try {
      const created = await createUserWorkout({ name: query.trim() });
      onSelect(created);
      setQuery("");
      onClose();
    } catch (error) {
      console.error("Failed to create workout:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close exercise picker"
      />

      <div className="relative flex max-h-[80vh] flex-col rounded-t-2xl bg-base-100 pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold">Add Exercise</h2>
          <button
            className="btn btn-sm btn-ghost btn-square"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="px-4 py-3">
          <input
            type="search"
            className="input input-bordered w-full text-base"
            placeholder="Search your exercises..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading && (
            <div className="py-8 text-center opacity-60">Loading...</div>
          )}

          {!isLoading && filtered.length === 0 && !query.trim() && (
            <div className="py-8 text-center opacity-60">
              No exercises yet. Type a name to create one.
            </div>
          )}

          <ul className="flex flex-col gap-1">
            {filtered.map((workout) => (
              <li key={workout.id}>
                <button
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-base-200"
                  onClick={() => {
                    onSelect(workout);
                    setQuery("");
                    onClose();
                  }}
                >
                  <span className="font-medium">{workoutName(workout)}</span>
                  {workout.globalWorkout?.muscleGroup && (
                    <span className="badge badge-ghost badge-sm">
                      {workout.globalWorkout.muscleGroup}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {query.trim() && !exactMatch && (
            <button
              className="btn btn-outline mt-3 w-full gap-1"
              onClick={createAndSelect}
              disabled={creating}
            >
              <span className="material-icons text-base">add</span>
              {creating ? "Creating..." : `Create "${query.trim()}"`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
