import { useState } from "react";
import { useAuth } from "./auth/authContext";

/* eslint-disable react/prop-types */
export const Workout = ({ workout }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ensure weights is always an array, even if undefined in workout object
  const weights = workout.weights || [];

  // Sort weights by date (newest first) and filter for current user
  const userWeights = weights
    .filter((entry) => entry.userId === user?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get the most recent weight (first element after sorting)
  const mostRecentWeight = userWeights.length > 0 ? userWeights[0].weight : 100;

  const [weight, setWeight] = useState(user ? mostRecentWeight : 100);

  const increaseTopSet = () => setWeight(Number(weight) + 5);
  const decreaseTopSet = () =>
    setWeight(Number(weight) ? Number(weight) - 5 : 0);

  const saveWeight = async () => {
    if (!saved) {
      setSaving(true);
      try {
        // Validate workout ID
        if (!workout || (!workout.id && !workout.dbId)) {
          throw new Error("No workout selected");
        }

        // Get the appropriate workout ID
        // If it's a template workout with a dbId, use that instead
        let workoutId = workout.dbId || workout.id;

        // Check for non-numeric IDs that don't have a dbId
        if (typeof workoutId === "string" && !/^\d+$/.test(workoutId)) {
          console.error("Invalid workout ID format (non-numeric):", workoutId);
          throw new Error(
            "Cannot save weight for this workout. This template workout doesn't have a database ID reference."
          );
        }

        // Parse the workout ID
        const parsedWorkoutId = parseInt(workoutId);
        if (isNaN(parsedWorkoutId)) {
          console.error("Failed to parse workout ID:", workoutId);
          throw new Error("Invalid workout ID format");
        }

        // Validate weight
        if (!weight) {
          throw new Error("Weight cannot be empty");
        }

        const numWeight = Number(weight);
        if (isNaN(numWeight) || numWeight <= 0) {
          throw new Error("Please enter a valid weight");
        }

        console.log(
          "Sending workoutId:",
          parsedWorkoutId,
          "type:",
          typeof parsedWorkoutId,
          "weight:",
          numWeight
        );

        // Format the date as ISO string to ensure it's in the correct format
        const currentDate = new Date().toISOString();

        console.log(
          "User object:",
          user ? `ID: ${user.id}, has token: ${!!user.token}` : "No user"
        );
        console.log(
          "Making API request to:",
          `${import.meta.env.VITE_API_URL}/weights/add`
        );

        if (!user || !user.token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/weights/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              workoutId: parsedWorkoutId,
              weight: numWeight,
              date: currentDate,
            }),
          }
        );

        if (!response.ok) {
          // First check the content type to determine how to parse the response
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Response error (JSON):", errorData);
            throw new Error(errorData.error || "Post failed");
          } else {
            // Handle text responses (like "Unauthorized")
            const errorText = await response.text();
            console.error("Response error (text):", errorText);
            throw new Error(
              errorText || `Request failed with status ${response.status}`
            );
          }
        } else {
          setSaving(false);
          setSaved(true);
        }
      } catch (error) {
        setSaving(false);
        console.error("Save failed", error);
        alert("Save failed: " + error.message);
      }
    } else {
      setSaved(false);
    }
  };

  return (
    <>
      <div
        className={`flex justify-between items-center ${
          workout.supersettedId ? "ml-5" : ""
        }`}
      >
        <div>
          {workout.supersettedId && "SS"}
          <div>{workout.name}</div>
          <div>
            {workout.sets}x{workout.reps}
            {workout.amrap && " - Last Set AMRAP"}
          </div>
          {user && <div>Top Set: {weight}</div>}
        </div>
        {user && (
          <div className="grid grid-cols-2 grid-rows-2">
            {!saved && (
              <>
                <button
                  onClick={increaseTopSet}
                  className="material-icons btn bg-transparent border-none shadow-none text-3xl font-normal"
                >
                  add
                </button>
                <button
                  onClick={decreaseTopSet}
                  className="material-icons btn bg-transparent border-none shadow-none text-3xl font-normal"
                >
                  remove
                </button>
              </>
            )}
            <button
              className={`btn col-span-2 ${
                saved ? "row-span-2 bg-green-300" : ""
              }`}
              onClick={saveWeight}
            >
              {!saving ? (
                !saved ? (
                  "save"
                ) : (
                  "done ✅"
                )
              ) : (
                <div className="spinner-box">
                  <span className="material-icons animate-spin spinner text-xl">
                    refresh
                  </span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
