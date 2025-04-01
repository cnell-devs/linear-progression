/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";
import { defaultTemplates } from "./templates/defaultTemplates";

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
        const response = await fetch(`${apiUrl}/workouts`, {
          headers: {
            ...authHeaders,
          },
        });

        if (!response.ok) {
          console.error("Error fetching workouts:", response.status);
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

      // Check if we're using a default template
      if (params && params.get("defaultTemplate")) {
        const templateId = params.get("defaultTemplate");
        const template = defaultTemplates.find((t) => t.id === templateId);

        if (template) {
          console.log("Using default template:", templateId);

          // Fetch real workouts from the database using the stored dbIds
          try {
            const response = await fetch(`${apiUrl}/workouts`, {
              headers: {
                ...authHeaders,
              },
            });

            if (!response.ok) {
              throw new Error("Failed to fetch workouts for template");
            }

            let allWorkouts = await response.json();

            // Find the real workout objects that match our template workout dbIds
            const dbIds = template.workouts
              .map((w) => w.dbId)
              .filter((id) => id !== undefined);
            console.log("Looking for workouts with database IDs:", dbIds);

            // Get the real workout objects from the database
            const matchedWorkouts = dbIds
              .map((dbId) => {
                const match = allWorkouts.find((w) => w.id === dbId);
                if (match) {
                  console.log(`Found workout with ID ${dbId}: ${match.name}`);
                  return match;
                } else {
                  console.warn(`No workout found with ID ${dbId}`);
                  return null;
                }
              })
              .filter((w) => w !== null);

            console.log("Found workouts:", matchedWorkouts);

            if (matchedWorkouts.length > 0) {
              setWorkouts(matchedWorkouts);
            } else {
              console.warn(
                "No matching workouts found in database. Using template workouts with warning."
              );
              // Use template workouts but with warning about ID issues
              setWorkouts(
                template.workouts.map((w) => ({
                  ...w,
                  id: w.dbId || w.id, // Try to use the dbId if available
                  _templateWorkout: true, // Mark as template workout
                }))
              );
            }
          } catch (error) {
            console.error("Error fetching real workouts for template:", error);
            console.warn(
              "Using template workouts with string IDs - weight tracking will not work"
            );
            setWorkouts(template.workouts);
          }
        } else {
          console.error("Default template not found:", templateId);
          setWorkouts([]);
        }
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
          let templateWorkouts = template.workouts || [];

          if (user) {
            templateWorkouts.forEach((workout) => {
              workout.weights =
                workout?.weights?.filter((entry) => entry.userId == user.id) ||
                [];
            });
          }

          setWorkouts(templateWorkouts);
        } catch (error) {
          console.error("Error loading template:", error);
          setWorkouts([]);
        }
        return;
      }

      // Normal split-based workout fetching
      const url = `${apiUrl}/workouts?split=${params.get(
        "split"
      )}&alt=${params.get("alt")}`;

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
