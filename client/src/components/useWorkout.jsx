/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "./auth/authContext";

export const useWorkout = (params) => {
  const [workouts, setWorkouts] = useState(null);
  const { user } = useAuth();

  const fetchWorkouts = async () => {
    try {
      // Get auth token if user is logged in
      const token = localStorage.getItem("authToken");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      // Log API URL from environment
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      console.log("Using API URL:", apiUrl);

      // If "all" is passed, fetch all workouts
      if (params === "all") {
        console.log("Fetching all workouts");
        console.log("Auth headers:", authHeaders);
        const response = await fetch(`${apiUrl}/workouts`, {
          headers: {
            ...authHeaders,
          },
        });

        if (!response.ok) {
          console.error(
            "Error fetching workouts:",
            response.status,
            response.statusText
          );
          if (response.status === 401) {
            console.error(
              "Authentication required - user may not be logged in"
            );
          }
          const errorText = await response.text();
          console.error("Error response:", errorText);
          setWorkouts([]);
          return;
        }

        let data = await response.json();
        console.log("Fetched workouts raw data:", data);

        // Debug: Print workouts that have user ID
        const userWorkouts = data.filter((w) => w.userId === user?.id);
        console.log("User-owned workouts in data:", userWorkouts);
        console.log("Current user ID:", user?.id);

        // Keep the weight entries filtering
        if (user) {
          data.forEach((workout) => {
            if (workout.weights) {
              workout.weights = workout.weights.filter(
                (entry) => entry.userId == user.id
              );
            } else {
              workout.weights = [];
            }
          });
        }

        console.log("Processed workouts data:", data);
        setWorkouts(data);
        return;
      }

      // Check if we're using a user template
      if (params && params.get("template")) {
        const templateId = params.get("template");
        const token = localStorage.getItem("authToken");

        try {
          const response = await fetch(`${apiUrl}/templates/${templateId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch template");

          const template = await response.json();
          let templateWorkouts = [];

          // Handle the new structure with templateWorkouts
          if (template.templateWorkouts) {
            templateWorkouts = template.templateWorkouts.map((tw) => {
              // Handle both legacy workouts and new userWorkouts
              const workout = tw.workout || tw.userWorkout;
              const workoutName = workout
                ? tw.userWorkout?.customName ||
                  tw.userWorkout?.globalWorkout?.name ||
                  workout.name
                : "Unknown Workout";

              return {
                id: workout?.id,
                name: workoutName,
                sets: tw.sets,
                reps: tw.reps,
                amrap: tw.amrap,
                templateId: template.id, // Add templateId for weight entry context
                // Extract weights from the nested structure
                weights: tw.userWorkout?.weights || workout?.weights || [],
                // Include other workout properties that might be needed
                muscleGroup:
                  tw.userWorkout?.globalWorkout?.muscleGroup ||
                  workout?.muscleGroup,
                equipment:
                  tw.userWorkout?.globalWorkout?.equipment ||
                  workout?.equipment,
                alternate: tw.userWorkout?.alternate || workout?.alternate,
                superset: tw.userWorkout?.superset || workout?.superset,
              };
            });
          }

          if (user) {
            templateWorkouts.forEach((workout) => {
              // Filter weights to only show entries for this template and user
              if (workout.weights) {
                workout.weights = workout.weights.filter(
                  (entry) =>
                    entry.userId == user.id && entry.templateId == template.id
                );
              } else {
                workout.weights = [];
              }
            });
          }

          setWorkouts(templateWorkouts);
        } catch (error) {
          console.error("Error loading template:", error);
          setWorkouts([]);
        }
        return;
      }

      // Normal workout fetching
      const url = `${apiUrl}/workouts?alt=${params.get("alt")}`;

      const response = await fetch(url, {
        headers: {
          ...authHeaders,
        },
      });

      let data = await response.json();

      if (!params.get("alt")) {
        const alternateIds = data
          .filter((workout) => workout.alternateId !== null)
          .map((workout) => workout.alternateId);

        data = data.filter((workout) => !alternateIds.includes(workout.id));
      } else {
        data = data.filter((workout) => !workout.alternateId);
      }

      if (user) {
        data.forEach((workout) => {
          workout.weights = workout?.weights.filter(
            (entry) => entry.userId == user.id
          );
        });
      }
      setWorkouts(data);
    } catch (error) {
      console.error("Error in fetchWorkouts:", error);
      setWorkouts([]);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [params]);

  return { workouts, fetchWorkouts };
};
