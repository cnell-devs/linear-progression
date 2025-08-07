import { useAuth } from "../auth/authContext";
import { GraphWorkout } from "../graphWorkout";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { Nav } from "../nav";
import { useState, useEffect, useMemo } from "react";
import { PastWeek } from "../pastWeek";
import { CreateWorkoutModal } from "../workouts/CreateWorkoutModal";
import { EditWorkoutModal } from "../workouts/EditWorkoutModal";
import { DeleteWorkoutModal } from "../workouts/DeleteWorkoutModal";
import { useSearchParams } from "react-router-dom";

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "stats";

  const { user } = useAuth();
  const { workouts, fetchUserWorkouts: fetchWorkouts } = useUserWorkouts();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Workout management state
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Update active tab if URL parameter changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["stats", "workouts", "account"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Filter workouts for workout management - only show user's own workouts
  const filteredWorkouts = useMemo(() => {
    return workouts
      ? workouts.filter((workout) => {
          const ownerMatch = String(workout.userId) === String(user?.id);
          return ownerMatch;
        })
      : [];
  }, [workouts, user?.id]);

  // Add debug logging for workouts
  useEffect(() => {
    if (workouts) {
      console.log("All workouts:", workouts);
      console.log("Filtered workouts:", filteredWorkouts);
      console.log("Current user ID:", user?.id);

      // Log all user-created workouts
      const userWorkouts = workouts.filter((w) => w.userId === user?.id);
      console.log("User workouts:", userWorkouts);
    }
  }, [workouts, filteredWorkouts, user]);

  // Handle workout creation
  const handleCreateWorkout = async (workoutData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        throw new Error("Not authenticated. Please log in again.");
      }

      // Using the environment variable for API URL
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      console.log("Creating workout with API URL:", apiUrl);
      console.log("Submitting workout data:", workoutData);

      // Ensure the userId is set to the current user
      const submitData = {
        ...workoutData,
        userId: user?.id, // Make sure userId is explicitly set
      };

      console.log("Final workout data being sent:", submitData);

      const response = await fetch(`${apiUrl}/v2/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      // Check the response status
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error creating workout:", response.status, errorData);
        throw new Error(`Failed to create workout (${response.status})`);
      }

      // Get the created workout data
      const createdWorkout = await response.json();
      console.log("Workout created successfully:", createdWorkout);

      setIsCreateModalOpen(false);

      // Force a refresh of workouts data
      await fetchWorkouts();
      console.log("Workouts refreshed after creation");

      return createdWorkout;
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  };

  // Handle workout editing
  const handleEditWorkout = async (id, workoutData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v2/workouts/${id}`,
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

  // Handle workout deletion
  const handleDeleteWorkout = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v2/workouts/${id}`,
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
      {workouts ? (
        <div className="flex flex-col gap-4">
          <div className="tabs tabs-boxed justify-center my-4">
            <a
              className={`tab ${activeTab === "stats" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </a>
            <a
              className={`tab ${activeTab === "workouts" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("workouts")}
            >
              My Workouts
            </a>
            <a
              className={`tab ${activeTab === "account" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </a>
          </div>

          {activeTab === "stats" && (
            <div className="flex flex-col gap-8">
              <PastWeek workouts={workouts} />
              <GraphWorkout workouts={workouts} fetchData={fetchWorkouts} />
            </div>
          )}

          {activeTab === "workouts" && (
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Workouts</h1>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      console.log("Manually refreshing workouts...");
                      fetchWorkouts();
                    }}
                  >
                    <span className="material-icons">refresh</span> Refresh
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Add New Workout
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Source</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkouts.length > 0 ? (
                      filteredWorkouts.map((workout) => (
                        <tr key={workout.id}>
                          <td>
                            <div className="flex items-center">
                              {workout.name}
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
                            <span
                              className={`badge ${
                                workout.globalWorkoutId
                                  ? "badge-success"
                                  : workout.pendingApproval
                                  ? "badge-warning"
                                  : "badge-info"
                              }`}
                            >
                              {workout.globalWorkoutId
                                ? "Global"
                                : workout.userCreated
                                ? workout.pendingApproval
                                  ? "Custom (Pending)"
                                  : "Custom"
                                : "Unknown"}
                            </span>
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
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="container mx-auto px-4">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="text-lg">{user?.username}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="text-lg">{user?.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="text-lg">
                      {user?.admin ? "Administrator" : "Standard User"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verified
                    </label>
                    <div className="text-lg">
                      {user?.verified ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workout modals */}
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
      ) : (
        <div className="spinner-box">
          <span className="material-icons animate-spin spinner text-6xl">
            refresh
          </span>
        </div>
      )}
    </>
  );
};
