/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// Name is the only thing a UserWorkout actually stores. Sets/reps/AMRAP belong
// to a template's entry for the exercise, not the exercise itself — the old
// edit form offered them and silently discarded them.
export const RenameExerciseModal = ({ workout, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(workout?.name || "");
    setError(null);
  }, [workout]);

  if (!workout) return null;

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-md">
        <h3 className="mb-4 text-lg font-bold">Rename Exercise</h3>
        <form onSubmit={submit}>
          <input
            type="text"
            className="input input-bordered w-full text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
            autoFocus
          />
          <p className="mt-2 text-xs opacity-60">
            Renaming keeps all {workout.usage?.sets || 0} logged sets attached.
          </p>
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
              type="submit"
              className="btn btn-primary"
              disabled={saving || !name.trim()}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
