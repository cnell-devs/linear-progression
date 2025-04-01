import { useAuth } from "../auth/authContext";
import { GraphWorkout } from "../graphWorkout";
import { useWorkout } from "../useWorkout";
import { Nav } from "../nav";
import { useState, useEffect } from "react";
import { PastWeek } from "../pastWeek";
import { CreateWorkoutModal } from "../workouts/CreateWorkoutModal";
import { EditWorkoutModal } from "../workouts/EditWorkoutModal";
import { DeleteWorkoutModal } from "../workouts/DeleteWorkoutModal";
import { useSearchParams } from "react-router-dom";

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "stats";

  const { user } = useAuth();
  const { workouts, fetchWorkouts } = useWorkout("all");
  const [activeTab, setActiveTab] = useState(initialTab);

  // Workout management state
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");

  // Update active tab if URL parameter changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["stats", "workouts", "account"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Filter workouts for workout management
  const filteredWorkouts = workouts
    ? workouts
        .filter((workout) => {
          const typeMatch = filter === "all" ? true : workout.type === filter;
          return typeMatch;
        })
        .filter((workout) => {
          let ownerMatch = false;

          // Debug each workout's ownership for filtering
          console.log(`Filtering workout: ${workout.name}`);
          console.log(`- userId: ${workout.userId} (${typeof workout.userId})`);
          console.log(`- user.id: ${user?.id} (${typeof user?.id})`);
          console.log(`- isGlobal: ${workout.isGlobal}`);
          console.log(`- ownerFilter: ${ownerFilter}`);

          if (ownerFilter === "all") {
            ownerMatch = true;
          } else if (ownerFilter === "mine") {
            // Fix: Use strict equality for userId matching and handle null/undefined cases
            ownerMatch = String(workout.userId) === String(user?.id);
            console.log(`- Mine filter match: ${ownerMatch}`);
          } else if (ownerFilter === "global") {
            ownerMatch = workout.isGlobal === true;
          }

          return ownerMatch;
        })
    : [];

  // Add debug logging for workouts
  useEffect(() => {
    if (workouts) {
      console.log("All workouts:", workouts);
      console.log("Filtered workouts:", filteredWorkouts);
      console.log("Current user ID:", user?.id);
      console.log("Current filters - Type:", filter, "Owner:", ownerFilter);

      // Log all user-created workouts
      const userWorkouts = workouts.filter((w) => w.userId === user?.id);
      console.log("User workouts:", userWorkouts);
    }
  }, [workouts, filteredWorkouts, filter, ownerFilter, user]);

  // Handle workout creation
  const handleCreateWorkout = async (workoutData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          reject(new Error("Not authenticated. Please log in again."));
          return;
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

        const response = await fetch(`${apiUrl}/workouts`, {
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
          reject(new Error(`Failed to create workout (${response.status})`));
          return;
        }

        // Get the created workout data
        const createdWorkout = await response.json();
        console.log("Workout created successfully:", createdWorkout);

        setIsCreateModalOpen(false);

        // Force a refresh of workouts data
        await fetchWorkouts();
        console.log("Workouts refreshed after creation");

        resolve(createdWorkout);
      } catch (error) {
        console.error("Error creating workout:", error);
        reject(error);
      }
    });
  };

  // Handle workout editing
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

  // Handle workout deletion
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
                    {filteredWorkouts.length > 0 ? (
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
