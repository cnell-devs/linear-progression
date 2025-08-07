import { useState } from "react";
import { Nav } from "../nav";
import { useWorkout } from "../useWorkout";
import { CreateWorkoutModal } from "../workouts/CreateWorkoutModal";
import { EditWorkoutModal } from "../workouts/EditWorkoutModal";
import { DeleteWorkoutModal } from "../workouts/DeleteWorkoutModal";

export function WorkoutManager() {
  const { workouts, fetchWorkouts } = useWorkout("all");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Show all workouts (no type filtering needed)
  const filteredWorkouts = workouts || [];

  const handleCreateWorkout = async (workoutData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) throw new Error("Failed to create workout");

      setIsCreateModalOpen(false);
      fetchWorkouts();
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  const handleEditWorkout = async (id, workoutData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/workouts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workoutData),
        }
      );

      if (!response.ok) throw new Error("Failed to update workout");

      setIsEditModalOpen(false);
      setSelectedWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/workouts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete workout");

      setIsDeleteModalOpen(false);
      setSelectedWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workout Management</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Workout
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts ? (
                filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>{workout.name}</td>
                      <td>{workout.sets}</td>
                      <td>{workout.reps}</td>
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
                    <td colSpan="4" className="text-center">
                      No workouts found.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    <span className="material-icons animate-spin spinner text-xl">
                      refresh
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CreateWorkoutModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateWorkout}
        />

        <EditWorkoutModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedWorkout(null);
          }}
          onSubmit={handleEditWorkout}
          workout={selectedWorkout}
        />

        <DeleteWorkoutModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedWorkout(null);
          }}
          onConfirm={handleDeleteWorkout}
          workout={selectedWorkout}
        />
      </div>
    </>
  );
}
