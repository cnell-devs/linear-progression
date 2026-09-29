/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// One logged set. Weight/reps are kept in local state while the user types and
// only pushed to the server on blur or on check-off, so every keystroke isn't
// a network round trip.
export const SetRow = ({
  set,
  index,
  previous,
  onCommit,
  onToggleComplete,
  onDelete,
}) => {
  const [weight, setWeight] = useState(set.weight ?? "");
  const [reps, setReps] = useState(set.reps ?? "");

  // Re-sync if the row is replaced by a server response (e.g. after a retry).
  useEffect(() => {
    setWeight(set.weight ?? "");
    setReps(set.reps ?? "");
  }, [set.weight, set.reps]);

  const commit = () => {
    const nextWeight = weight === "" ? 0 : Number(weight);
    const nextReps = reps === "" ? 0 : Number(reps);
    if (nextWeight === set.weight && nextReps === set.reps) return;
    onCommit({ weight: nextWeight, reps: nextReps });
  };

  const previousLabel = previous
    ? `${previous.weight} × ${previous.reps}`
    : "—";

  return (
    <div
      className={`grid grid-cols-[1.5rem_0.8fr_1fr_1fr_2.25rem_1.75rem] items-center gap-1.5 rounded-lg px-1 py-1.5 ${
        set.completed ? "bg-success/10" : ""
      }`}
    >
      <div className="text-center text-sm font-bold opacity-70">
        {set.isWarmup ? (
          <span className="text-warning" title="Warm-up set">
            W
          </span>
        ) : (
          index + 1
        )}
      </div>

      <button
        type="button"
        className="truncate text-center text-xs opacity-60 disabled:opacity-40"
        disabled={!previous}
        onClick={() => {
          // Tapping "previous" copies last time's numbers in — the fastest
          // path when you're repeating a weight.
          setWeight(previous.weight);
          setReps(previous.reps);
          onCommit({ weight: previous.weight, reps: previous.reps });
        }}
        title={previous ? "Tap to copy last time's set" : "No previous data"}
      >
        {previousLabel}
      </button>

      <input
        type="number"
        inputMode="decimal"
        className="input input-sm input-bordered w-full text-center text-base"
        value={weight}
        placeholder={previous ? String(previous.weight) : "0"}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={commit}
        aria-label={`Set ${index + 1} weight`}
      />

      <input
        type="number"
        inputMode="numeric"
        className="input input-sm input-bordered w-full text-center text-base"
        value={reps}
        placeholder={previous ? String(previous.reps) : "0"}
        onChange={(e) => setReps(e.target.value)}
        onBlur={commit}
        aria-label={`Set ${index + 1} reps`}
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          className={`btn btn-sm btn-square ${
            set.completed ? "btn-success" : "btn-ghost border border-base-300"
          }`}
          onClick={() => {
            const nextWeight = weight === "" ? 0 : Number(weight);
            const nextReps = reps === "" ? 0 : Number(reps);
            onToggleComplete({ weight: nextWeight, reps: nextReps });
          }}
          aria-label={
            set.completed ? "Mark set incomplete" : "Mark set complete"
          }
        >
          <span className="material-icons text-lg">check</span>
        </button>
      </div>

      <button
        type="button"
        className="btn btn-xs btn-ghost btn-square opacity-40 hover:opacity-100 hover:text-error"
        onClick={onDelete}
        aria-label={`Remove set ${index + 1}`}
        title="Remove this set"
      >
        <span className="material-icons text-base">close</span>
      </button>
    </div>
  );
};
