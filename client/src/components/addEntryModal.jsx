/* eslint-disable react/prop-types */
import {
  convertUtcToDateFormat,
  convertUTCToLocalUTC,
} from "../utils/date-formatter";
import { useAuth } from "./auth/authContext";
import { useState } from "react";

export const AddEntryModal = ({ selected, fetchData }) => {
  const { user } = useAuth();

  const [weight, setWeight] = useState(100);
  // Format today's date to match the date input element (YYYY-MM-DD)
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [date, setDate] = useState(formattedToday);

  const saveWeight = async () => {
    try {
      // Validate workout selection
      if (!selected || (!selected.id && !selected.dbId)) {
        throw new Error("No workout selected");
      }

      // Get the appropriate workout ID
      // If it's a template workout with a dbId, use that instead
      let workoutId = selected.dbId || selected.id;

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

      // Validate date
      if (!date) {
        throw new Error("Date is required");
      }

      // Convert the date string to a proper ISO format the server can parse
      // Input date from form is in YYYY-MM-DD format
      // Convert to ISO string for the server
      const formattedDate = new Date(date);

      // Ensure the date is valid
      if (isNaN(formattedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      // Convert to proper ISO string
      const isoDate = formattedDate.toISOString();

      console.log(
        "User object:",
        user ? `ID: ${user.id}, has token: ${!!user.token}` : "No user"
      );
      console.log(
        "Making API request to:",
        `${import.meta.env.VITE_API_URL}/weights/add`
      );

      if (!user || !user.token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log(
        "Sending workoutId:",
        parsedWorkoutId,
        "type:",
        typeof parsedWorkoutId,
        "weight:",
        numWeight,
        "date:",
        isoDate,
        "original date:",
        date
      );

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
            date: isoDate,
            weight: numWeight,
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
      }

      fetchData();
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed: " + error.message);
    }
  };

  return (
    <>
      <dialog id="add_entry_modal" className="modal">
        {
          <div className="modal-box flex flex-col gap-6">
            <h3 className="font-extrabold text-center text-lg ">
              {selected?.name}
            </h3>
            {selected ? (
              <form action="">
                <label className="">
                  Enter Date: &nbsp;
                  <input
                    type="date"
                    name="add_date"
                    id="add_date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </label>
                <br />
                <label className="">
                  Enter Weight: &nbsp;
                  <input
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => setWeight(Math.round(weight / 5) * 5)}
                    type="number"
                    name="add_weight"
                    id="add_weight"
                    // step="5"
                    pattern="[0-9]*"
                    value={weight}
                  />
                </label>
              </form>
            ) : (
              <p className="flex justify-center font-bold">Select a Workout</p>
            )}
            <div className="modal-action m-0">
              <form method="dialog">
                <div className="flex gap-2">
                  <button className="btn">Discard</button>

                  {selected && (
                    <button
                      className="btn bg-blue-500 text-white px-6"
                      onClick={saveWeight}
                    >
                      save
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        }
      </dialog>
    </>
  );
};
