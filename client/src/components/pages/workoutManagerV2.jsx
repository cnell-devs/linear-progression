import { useState } from "react";
import { Nav } from "../nav";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { CreateWorkoutModalV2 } from "../workouts/CreateWorkoutModalV2";

export function WorkoutManagerV2() {
  const {
    workouts,
    isLoading,
    error,
    createUserWorkout,
    updateUserWorkout,
    deleteUserWorkout,
  } = useUserWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCreateWorkout = async (workoutData) => {
    try {
      await createUserWorkout(workoutData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating workout:", error);
      alert(`Failed to create workout: ${error.message}`);
    }
  };

  const handleEditWorkout = async (id, workoutData) => {
    try {
      await updateUserWorkout(id, workoutData);
      setIsEditModalOpen(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error("Error updating workout:", error);
      alert(`Failed to update workout: ${error.message}`);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteUserWorkout(id);
      setIsDeleteModalOpen(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert(`Failed to delete workout: ${error.message}`);
    }
  };

  const getWorkoutDisplayName = (workout) => {
    return workout.name || "Unnamed Workout";
  };

  const getWorkoutSource = (workout) => {
    if (workout.globalWorkoutId) {
      return "Global";
    } else if (workout.userCreated) {
      return workout.pendingApproval ? "Custom (Pending)" : "Custom";
    }
    return "Unknown";
  };

  if (error) {
    return (
      <>
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Workout Management V2
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Enhanced workout system with global workout database
            </p>
          </div>
          <button
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="material-icons text-sm mr-1">add</span>
            Add New Workout
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
            ✨ What&apos;s New in V2?
          </h3>
          <ul className="text-blue-700 text-xs sm:text-sm space-y-1">
            <li>
              • <strong>Smart Autocomplete:</strong> Search from thousands of
              pre-built exercises
            </li>
            <li>
              • <strong>Global Database:</strong> Workouts are shared and
              improved by the community
            </li>
            <li>
              • <strong>Custom Workouts:</strong> Create your own exercises that
              can be suggested to others
            </li>
            <li>
              • <strong>Better Organization:</strong> Workouts are categorized
              by muscle group and equipment
            </li>
          </ul>
        </div>

        {/* Workouts Display - Responsive */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="material-icons animate-spin spinner text-xl">
              refresh
            </span>
            <span className="ml-2">Loading workouts...</span>
          </div>
        ) : workouts && workouts.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Muscle Group</th>
                    <th>Equipment</th>
                    <th>Source</th>
                    <th>Latest Weight</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>
                        <div className="flex items-center">
                          {getWorkoutDisplayName(workout)}
                          {workout.alt && (
                            <span className="ml-2 badge badge-sm badge-secondary">
                              ALT
                            </span>
                          )}
                          {workout.ss && (
                            <span className="ml-2 badge badge-sm badge-accent">
                              SS
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {workout.muscleGroup ? (
                          <span className="badge badge-secondary">
                            {workout.muscleGroup}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td>
                        {workout.equipment ? (
                          <span className="badge badge-accent">
                            {workout.equipment}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            workout.globalWorkoutId
                              ? "badge-success"
                              : workout.pendingApproval
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {getWorkoutSource(workout)}
                        </span>
                      </td>
                      <td>
                        {workout.weights && workout.weights.length > 0 ? (
                          <span className="font-mono">
                            {workout.weights[0].weight} lbs
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setSelectedWorkout(workout);
                              setIsEditModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => {
                              setSelectedWorkout(workout);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="card bg-base-100 shadow-md border"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="card-title text-lg mb-2">
                          {getWorkoutDisplayName(workout)}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {workout.alt && (
                            <span className="badge badge-sm badge-secondary">
                              ALT
                            </span>
                          )}
                          {workout.ss && (
                            <span className="badge badge-sm badge-accent">
                              SS
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Muscle Group:</span>
                        {workout.muscleGroup ? (
                          <span className="badge badge-secondary badge-sm">
                            {workout.muscleGroup}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipment:</span>
                        {workout.equipment ? (
                          <span className="badge badge-accent badge-sm">
                            {workout.equipment}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span
                          className={`badge badge-sm ${
                            workout.globalWorkoutId
                              ? "badge-success"
                              : workout.pendingApproval
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {getWorkoutSource(workout)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Latest Weight:</span>
                        {workout.weights && workout.weights.length > 0 ? (
                          <span className="font-mono text-sm">
                            {workout.weights[0].weight} lbs
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4 gap-2">
                      <button
                        className="btn btn-sm btn-outline flex-1"
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error flex-1"
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <span className="material-icons text-6xl mb-4 block">
                fitness_center
              </span>
              <p className="text-lg mb-2">No workouts found.</p>
              <p className="text-sm">
                Click &quot;Add New Workout&quot; to get started!
              </p>
            </div>
          </div>
        )}

        {/* Create Workout Modal */}
        <CreateWorkoutModalV2
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateWorkout}
        />

        {/* TODO: Add Edit and Delete modals for V2 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Edit Workout
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Edit functionality will be available in the next update.
              </p>
              <div className="flex justify-end space-y-2 sm:space-y-0 sm:space-x-2 flex-col sm:flex-row">
                <button
                  className="btn btn-outline w-full sm:w-auto"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedWorkout(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Delete Workout
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Are you sure you want to delete &quot;{selectedWorkout?.name}
                &quot;? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedWorkout(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error w-full sm:w-auto order-1 sm:order-2"
                  onClick={() => handleDeleteWorkout(selectedWorkout.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
