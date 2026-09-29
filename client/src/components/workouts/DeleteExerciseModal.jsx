/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// Deleting a UserWorkout cascades to its sets, weight entries, and template
// slots. That history is unrecoverable, so the confirmation states exactly
// what disappears and requires typing the name when there's data at stake.
export const DeleteExerciseModal = ({ workout, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setConfirmText("");
    setError(null);
  }, [workout]);

  if (!workout) return null;

  const sets = workout.usage?.sets || 0;
  const entries = workout.usage?.weightEntries || 0;
  const templates = workout.usage?.templates || 0;
  const hasHistory = sets > 0 || entries > 0 || templates > 0;

  // Only make them type the name when something real is lost.
  const confirmed = !hasHistory || confirmText.trim() === workout.name;

  const remove = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-md">
        <h3 className="mb-2 text-lg font-bold">Delete “{workout.name}”?</h3>

        {hasHistory ? (
          <>
            <p className="text-sm">This permanently deletes:</p>
            <ul className="my-3 flex flex-col gap-1 rounded-lg bg-error/10 p-3 text-sm">
              {sets > 0 && (
                <li className="flex items-center gap-2">
                  <span className="material-icons text-base text-error">
                    fitness_center
                  </span>
                  <strong>{sets}</strong> logged set{sets === 1 ? "" : "s"}
                </li>
              )}
              {entries > 0 && (
                <li className="flex items-center gap-2">
                  <span className="material-icons text-base text-error">
                    monitor_weight
                  </span>
                  <strong>{entries}</strong> weight entr
                  {entries === 1 ? "y" : "ies"}
                </li>
              )}
              {templates > 0 && (
                <li className="flex items-center gap-2">
                  <span className="material-icons text-base text-error">
                    list_alt
                  </span>
                  removed from <strong>{templates}</strong> template
                  {templates === 1 ? "" : "s"}
                </li>
              )}
            </ul>
            <p className="mb-2 text-sm">
              Type <strong>{workout.name}</strong> to confirm.
            </p>
            <input
              type="text"
              className="input input-bordered w-full text-base"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={workout.name}
              autoFocus
            />
          </>
        ) : (
          <p className="text-sm opacity-70">
            This exercise has no logged history, so nothing else is affected.
          </p>
        )}

        {error && (
          <div className="alert alert-error mt-3 text-sm">
            <span>{error}</span>
          </div>
        )}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            disabled={!confirmed || deleting}
            onClick={remove}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
};
