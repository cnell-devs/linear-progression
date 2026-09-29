/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { WorkoutAutocomplete } from "../WorkoutAutocomplete";
import { useWorkoutAutocomplete } from "../useWorkoutAutocomplete";
import { workoutName } from "../../utils/workout-display";

const DEFAULT_SETS = 3;
const DEFAULT_REPS = "8-12";

// One form for both creating and editing a template — `template` being null
// means create. Sets/reps/AMRAP are edited in exactly one place: the row for
// each exercise. The old flow asked for them twice, once in a "configure"
// step and again inline, with identical defaults.
export function TemplateFormModal({
  isOpen,
  onClose,
  onSubmit,
  template,
  // Called after the autocomplete creates a new exercise, so the library
  // listing behind the modal stays current.
  onWorkoutCreated,
}) {
  const isEdit = Boolean(template);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { isCreatingWorkout, handleWorkoutSelect } =
    useWorkoutAutocomplete(onWorkoutCreated);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setQuery("");
    setName(template?.name || "");
    setDescription(template?.description || "");
    setExercises(
      (template?.templateWorkouts || [])
        .filter((tw) => tw.userWorkout)
        .map((tw) => ({
          id: tw.userWorkout.id,
          name: workoutName(tw.userWorkout),
          sets: tw.sets,
          reps: tw.reps,
          amrap: tw.amrap,
        }))
    );
  }, [isOpen, template]);

  const addExercise = async (selected) => {
    setQuery("");
    setError(null);
    try {
      await handleWorkoutSelect(selected, (workout) => {
        setExercises((prev) => {
          // The template_workout table is unique on (templateId, userWorkoutId),
          // so a duplicate would fail at the database. Refuse it here instead.
          if (prev.some((e) => e.id === workout.id)) {
            setError(`"${workout.name}" is already in this template.`);
            return prev;
          }
          return [
            ...prev,
            {
              id: workout.id,
              name: workout.name,
              sets: workout.sets ?? DEFAULT_SETS,
              reps: workout.reps ?? DEFAULT_REPS,
              amrap: workout.amrap ?? false,
            },
          ];
        });
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const update = (id, field, value) =>
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  const remove = (id) =>
    setExercises((prev) => prev.filter((e) => e.id !== id));

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Template name is required.");
      return;
    }
    if (exercises.length === 0) {
      setError("Add at least one exercise.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        workouts: exercises.map((e) => ({
          id: e.id,
          sets: Number(e.sets) || 1,
          reps: String(e.reps).trim() || DEFAULT_REPS,
          amrap: Boolean(e.amrap),
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box flex max-h-[90vh] w-11/12 max-w-lg flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        <h3 className="text-lg font-bold">
          {isEdit ? "Edit Template" : "Create Template"}
        </h3>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push Day"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description (optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full text-base"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chest, shoulders, triceps"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Add an exercise</span>
            </label>
            <WorkoutAutocomplete
              value={query}
              onChange={setQuery}
              onSelect={addExercise}
              placeholder="Search, or type a new name to create one"
              className={isCreatingWorkout ? "opacity-50" : ""}
              disabled={isCreatingWorkout}
            />
            {isCreatingWorkout && (
              <div className="mt-1 flex items-center gap-1 text-sm opacity-60">
                <span className="loading loading-spinner loading-xs" />
                Adding...
              </div>
            )}
          </div>

          {exercises.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold uppercase tracking-wide opacity-50">
                {exercises.length} exercise{exercises.length === 1 ? "" : "s"}
              </div>

              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="rounded-lg border border-base-300 bg-base-100 p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="flex-1 break-words font-medium">
                      {exercise.name}
                    </span>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost btn-square text-error"
                      onClick={() => remove(exercise.id)}
                      aria-label={`Remove ${exercise.name}`}
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                    <div>
                      <label className="mb-1 block text-xs opacity-60">
                        Sets
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        className="input input-sm input-bordered w-full text-base"
                        value={exercise.sets}
                        onChange={(e) =>
                          update(exercise.id, "sets", e.target.value)
                        }
                        onBlur={(e) =>
                          update(
                            exercise.id,
                            "sets",
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs opacity-60">
                        Reps
                      </label>
                      <input
                        type="text"
                        className="input input-sm input-bordered w-full text-base"
                        value={exercise.reps}
                        placeholder={DEFAULT_REPS}
                        onChange={(e) =>
                          update(exercise.id, "reps", e.target.value)
                        }
                      />
                    </div>
                    <label className="flex cursor-pointer items-center gap-1 pb-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={exercise.amrap || false}
                        onChange={(e) =>
                          update(exercise.id, "amrap", e.target.checked)
                        }
                      />
                      <span className="text-xs">AMRAP</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action mt-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn order-2 sm:order-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary order-1 sm:order-2"
              disabled={saving || isCreatingWorkout}
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
