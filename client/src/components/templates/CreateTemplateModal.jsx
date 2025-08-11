import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWorkout } from "../useWorkout";
import { WorkoutAutocomplete } from "../WorkoutAutocomplete";
import { useWorkoutAutocomplete } from "../useWorkoutAutocomplete";

export function CreateTemplateModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [autocompleteQuery, setAutocompleteQuery] = useState("");
  // Configuration state for autocomplete selected workouts
  const [showWorkoutConfig, setShowWorkoutConfig] = useState(false);
  const [pendingWorkout, setPendingWorkout] = useState(null);
  const [configSets, setConfigSets] = useState(3);
  const [configReps, setConfigReps] = useState("8-12");
  const [configAmrap, setConfigAmrap] = useState(false);
  const { fetchWorkouts } = useWorkout("all");
  const { isCreatingWorkout, handleWorkoutSelect } =
    useWorkoutAutocomplete(fetchWorkouts);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setSelectedWorkouts([]);
      setAutocompleteQuery("");
      setShowWorkoutConfig(false);
      setPendingWorkout(null);
      setConfigSets(3);
      setConfigReps("8-12");
      setConfigAmrap(false);
    }
  }, [isOpen]);

  // Wrapper function to handle workout addition from autocomplete
  const handleAutocompleteSelect = async (selectedWorkout) => {
    setAutocompleteQuery("");

    await handleWorkoutSelect(selectedWorkout, (workoutToAdd) => {
      // Instead of adding directly, show configuration modal
      setPendingWorkout(workoutToAdd);
      setConfigSets(3);
      setConfigReps("8-12");
      setConfigAmrap(false);
      setShowWorkoutConfig(true);
    });
  };

  // Add the configured workout to the selected list
  const handleWorkoutConfigConfirm = () => {
    if (pendingWorkout) {
      setSelectedWorkouts((prev) => [
        ...prev,
        {
          ...pendingWorkout,
          sets: configSets,
          reps: configReps,
          amrap: configAmrap,
        },
      ]);
      setShowWorkoutConfig(false);
      setPendingWorkout(null);
      setConfigSets(3);
      setConfigReps("8-12");
      setConfigAmrap(false);
    }
  };

  // Cancel workout configuration
  const handleWorkoutConfigCancel = () => {
    setShowWorkoutConfig(false);
    setPendingWorkout(null);
    setConfigSets(3);
    setConfigReps("8-12");
    setConfigAmrap(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedWorkouts.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      workouts: selectedWorkouts.map((workout) => ({
        id: workout.id,
        sets: workout.sets,
        reps: workout.reps,
        amrap: workout.amrap,
      })),
    });
  };

  const updateWorkoutConfig = (workoutId, field, value) => {
    setSelectedWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === workoutId ? { ...workout, [field]: value } : workout
      )
    );
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Create Workout Template</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Template Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description (optional)"
            />
          </div>

          <div className="form-control mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="label">
                <span className="label-text">Add Workouts *</span>
              </label>
            </div>

            {/* Smart Autocomplete for adding workouts */}
            <div className="mb-4 relative z-0">
              <label className="label">
                <span className="label-text">Search for workouts to add</span>
              </label>
              <WorkoutAutocomplete
                value={autocompleteQuery}
                onChange={setAutocompleteQuery}
                onSelect={handleAutocompleteSelect}
                placeholder="Search workouts or type a new name to create custom workout..."
                className={isCreatingWorkout ? "opacity-50" : ""}
                disabled={isCreatingWorkout}
              />
              {isCreatingWorkout && (
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span className="loading loading-spinner loading-xs"></span>
                  Adding workout...
                </div>
              )}
            </div>

            {/* Instructions for custom workout creation */}
            <div className="mb-4">
              <div className="text-sm text-gray-600">
                <span className="material-icons text-xs mr-1">info</span>
                Tip: Type a workout name that doesn&apos;t exist to create a
                custom workout
              </div>
            </div>

            {/* Selected Workouts with Inline Editing */}
            {selectedWorkouts.length > 0 && (
              <div className="mb-4 p-3 bg-base-100 border border-gray-200 rounded">
                <h4 className="font-medium text-gray-800 mb-3">
                  Selected Workouts ({selectedWorkouts.length})
                </h4>
                <div className="space-y-3">
                  {selectedWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-white p-3 rounded border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{workout.name}</span>
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost text-error hover:bg-error hover:text-white"
                          onClick={() =>
                            setSelectedWorkouts((prev) =>
                              prev.filter((w) => w.id !== workout.id)
                            )
                          }
                          title="Remove workout from template"
                        >
                          <span className="material-icons text-xs">close</span>
                        </button>
                      </div>

                      {/* Inline editing controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Sets
                          </label>
                          <input
                            type="number"
                            className="input input-xs input-bordered w-full"
                            value={workout.sets}
                            min="1"
                            onChange={(e) =>
                              updateWorkoutConfig(
                                workout.id,
                                "sets",
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Reps
                          </label>
                          <input
                            type="text"
                            className="input input-xs input-bordered w-full"
                            value={workout.reps}
                            placeholder="8-12"
                            onChange={(e) =>
                              updateWorkoutConfig(
                                workout.id,
                                "reps",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center sm:justify-center">
                          <label className="cursor-pointer label">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs"
                              checked={workout.amrap || false}
                              onChange={(e) =>
                                updateWorkoutConfig(
                                  workout.id,
                                  "amrap",
                                  e.target.checked
                                )
                              }
                            />
                            <span className="label-text text-xs ml-1">
                              AMRAP
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workout Configuration Modal for Autocomplete Selected Workouts */}
            {showWorkoutConfig && pendingWorkout && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <h4 className="font-semibold mb-3 text-blue-800">
                  Configure: {pendingWorkout.name}
                </h4>
                <div className="grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">
                        <span className="label-text">Sets *</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="input input-bordered input-sm w-full"
                        value={configSets}
                        onChange={(e) =>
                          setConfigSets(parseInt(e.target.value) || 1)
                        }
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Reps *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-full"
                        value={configReps}
                        onChange={(e) => setConfigReps(e.target.value)}
                        placeholder="8-12"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="configAmrap"
                        className="checkbox checkbox-sm"
                        checked={configAmrap}
                        onChange={(e) => setConfigAmrap(e.target.checked)}
                      />
                      <label
                        htmlFor="configAmrap"
                        className="label cursor-pointer"
                      >
                        <span className="label-text ml-2">
                          AMRAP (As Many Reps As Possible)
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={handleWorkoutConfigCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleWorkoutConfigConfirm}
                    >
                      Add to Template
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-action flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              className="btn w-full sm:w-auto order-2 sm:order-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

CreateTemplateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
