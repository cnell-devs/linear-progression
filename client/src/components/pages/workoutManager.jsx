import { useState, useEffect } from "react";
import { Nav } from "../nav";
import { useAuth } from "../auth/authContext";
import { useWorkout } from "../useWorkout";
import { CreateWorkoutModal } from "../workouts/CreateWorkoutModal";
import { EditWorkoutModal } from "../workouts/EditWorkoutModal";
import { DeleteWorkoutModal } from "../workouts/DeleteWorkoutModal";

export function WorkoutManager() {
  const { user } = useAuth();
  const { workouts, fetchWorkouts } = useWorkout("all");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");

  // Filter workouts by type and ownership
  const filteredWorkouts = workouts
    ? workouts
        .filter((workout) =>
          filter === "all" ? true : workout.type === filter
        )
        .filter((workout) => {
          if (ownerFilter === "all") return true;
          if (ownerFilter === "mine") return workout.userId === user?.id;
          if (ownerFilter === "global") return workout.isGlobal;
          return true;
        })
    : [];

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

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Filter Workouts</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Workout Type
              </span>
              <div className="tabs">
                <a
                  className={`tab tab-bordered ${
                    filter === "all" ? "tab-active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </a>
                <a
                  className={`tab tab-bordered ${
                    filter === "push" ? "tab-active" : ""
                  }`}
                  onClick={() => setFilter("push")}
                >
                  Push
                </a>
                <a
                  className={`tab tab-bordered ${
                    filter === "pull" ? "tab-active" : ""
                  }`}
                  onClick={() => setFilter("pull")}
                >
                  Pull
                </a>
                <a
                  className={`tab tab-bordered ${
                    filter === "legs" ? "tab-active" : ""
                  }`}
                  onClick={() => setFilter("legs")}
                >
                  Legs
                </a>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Ownership
              </span>
              <div className="tabs">
                <a
                  className={`tab tab-bordered ${
                    ownerFilter === "all" ? "tab-active" : ""
                  }`}
                  onClick={() => setOwnerFilter("all")}
                >
                  All
                </a>
                <a
                  className={`tab tab-bordered ${
                    ownerFilter === "mine" ? "tab-active" : ""
                  }`}
                  onClick={() => setOwnerFilter("mine")}
                >
                  My Workouts
                </a>
                <a
                  className={`tab tab-bordered ${
                    ownerFilter === "global" ? "tab-active" : ""
                  }`}
                  onClick={() => setOwnerFilter("global")}
                >
                  Global
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts ? (
                filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout) => (
                    <tr
                      key={workout.id}
                      className={workout.isGlobal ? "bg-gray-50" : ""}
                    >
                      <td>{workout.name}</td>
                      <td>{workout.type}</td>
                      <td>{workout.sets}</td>
                      <td>{workout.reps}</td>
                      <td>
                        {workout.isGlobal ? (
                          <span className="badge badge-info">Global</span>
                        ) : workout.userId === user?.id ? (
                          <span className="badge">Mine</span>
                        ) : (
                          <span className="badge badge-secondary">
                            Other User
                          </span>
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
                          {(user?.admin || workout.userId === user?.id) && (
                            <button
                              className="btn btn-sm btn-outline btn-error"
                              onClick={() => {
                                setSelectedWorkout(workout);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No workouts found.
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
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
