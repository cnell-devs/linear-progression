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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Workout Management V2</h1>
            <p className="text-gray-600 mt-1">
              Enhanced workout system with global workout database
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="material-icons text-sm mr-1">add</span>
            Add New Workout
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            ✨ What&apos;s New in V2?
          </h3>
          <ul className="text-blue-700 text-sm space-y-1">
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

        {/* Workouts Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Muscle Group</th>
                <th>Equipment</th>
                <th>Source</th>
                <th>Latest Weight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <span className="material-icons animate-spin spinner text-xl">
                      refresh
                    </span>
                    <span className="ml-2">Loading workouts...</span>
                  </td>
                </tr>
              ) : workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
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
                      {workout.category ? (
                        <span className="badge badge-primary">
                          {workout.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="text-gray-500">
                      <span className="material-icons text-4xl mb-2">
                        fitness_center
                      </span>
                      <p>No workouts found.</p>
                      <p className="text-sm">
                        Click &quot;Add New Workout&quot; to get started!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Workout Modal */}
        <CreateWorkoutModalV2
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateWorkout}
        />

        {/* TODO: Add Edit and Delete modals for V2 */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Workout</h2>
              <p className="text-gray-600 mb-4">
                Edit functionality will be available in the next update.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="btn btn-outline"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Workout</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete &quot;{selectedWorkout?.name}
                &quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedWorkout(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
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
