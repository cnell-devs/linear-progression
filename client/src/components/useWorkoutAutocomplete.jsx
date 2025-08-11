import { useState } from "react";
import { useAuth } from "./auth/authContext";

export function useWorkoutAutocomplete(fetchWorkouts) {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const { user } = useAuth();

  // Handle workout selection from autocomplete
  const handleWorkoutSelect = async (selectedWorkout, onWorkoutAdded) => {
    console.log("handleWorkoutSelect called with:", selectedWorkout);

    if (selectedWorkout.isCustom) {
      // Handle custom workout creation
      await handleCreateCustomWorkout(selectedWorkout.name, onWorkoutAdded);
    } else {
      // Handle global workout selection
      await handleGlobalWorkoutSelect(selectedWorkout, onWorkoutAdded);
    }
  };

  // Create a custom workout
  const handleCreateCustomWorkout = async (workoutName, onWorkoutAdded) => {
    setIsCreatingWorkout(true);
    try {
      const token = localStorage.getItem("authToken");
      const workoutData = {
        name: workoutName.trim(),
        alt: false,
        userId: user?.id,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workout: ${response.status}`);
      }

      const createdWorkout = await response.json();
      console.log("Created workout response:", createdWorkout);

      if (fetchWorkouts) {
        await fetchWorkouts();
      }

      // Add to selected workouts
      const workoutToAdd = {
        ...createdWorkout,
        name: createdWorkout.name || workoutName.trim(), // Ensure name is set
        sets: 3,
        reps: "8-12",
        amrap: false,
      };

      if (onWorkoutAdded) {
        onWorkoutAdded(workoutToAdd);
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      alert(`Failed to create workout: ${error.message}`);
    } finally {
      setIsCreatingWorkout(false);
    }
  };

  // Handle global workout selection and create user workout if needed
  const handleGlobalWorkoutSelect = async (globalWorkout, onWorkoutAdded) => {
    setIsCreatingWorkout(true);
    try {
      const token = localStorage.getItem("authToken");

      // First, try to create a user workout from the global workout
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v2/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            globalWorkoutId: globalWorkout.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add global workout: ${response.status}`);
      }

      const userWorkout = await response.json();
      console.log("Global workout user workout response:", userWorkout);
      console.log("Global workout original:", globalWorkout);

      if (fetchWorkouts) {
        await fetchWorkouts();
      }

      // Add to selected workouts with the user workout data
      const workoutToAdd = {
        id: userWorkout.id || globalWorkout.id,
        name: globalWorkout.name,
        sets: 3,
        reps: "8-12",
        amrap: false,
        muscleGroup: globalWorkout.muscleGroup,
        equipment: globalWorkout.equipment,
      };

      if (onWorkoutAdded) {
        onWorkoutAdded(workoutToAdd);
      }
    } catch (error) {
      console.error("Error adding global workout:", error);
      // Fallback: add as a temporary workout for now
      const workoutToAdd = {
        id: `temp-${globalWorkout.id}`,
        name: globalWorkout.name,
        sets: 3,
        reps: "8-12",
        amrap: false,
        muscleGroup: globalWorkout.muscleGroup,
        equipment: globalWorkout.equipment,
        isGlobal: true,
        globalWorkoutId: globalWorkout.id,
      };

      if (onWorkoutAdded) {
        onWorkoutAdded(workoutToAdd);
      }
    } finally {
      setIsCreatingWorkout(false);
    }
  };

  return {
    isCreatingWorkout,
    handleWorkoutSelect,
    handleCreateCustomWorkout,
    handleGlobalWorkoutSelect,
  };
}
