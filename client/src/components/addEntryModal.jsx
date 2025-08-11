/* eslint-disable react/prop-types */
import { useAuth } from "./auth/authContext";
import { useTemplates } from "../hooks/useTemplates";
import { useState } from "react";

export const AddEntryModal = ({ fetchData }) => {
  const { user } = useAuth();
  const { userTemplates, loading } = useTemplates();

  const [weight, setWeight] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  // Format today's date to match the date input element (YYYY-MM-DD)
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [date, setDate] = useState(formattedToday);

  const resetForm = () => {
    setSelectedTemplate("");
    setSelectedWorkout("");
    setWeight(100);
    setDate(formattedToday);
  };

  // Get workouts for the selected template
  const getTemplateWorkouts = () => {
    if (!selectedTemplate) return [];
    const template = userTemplates.find(
      (t) => t.id === parseInt(selectedTemplate)
    );
    return template?.templateWorkouts || [];
  };

  // Handle template selection change
  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setSelectedWorkout(""); // Reset workout selection when template changes
  };

  const saveWeight = async () => {
    try {
      // Validate template selection
      if (!selectedTemplate) {
        throw new Error("Please select a template");
      }

      // Validate workout selection
      if (!selectedWorkout) {
        throw new Error("Please select a workout from the template");
      }

      // Find the selected template to get workout information
      const template = userTemplates.find(
        (t) => t.id === parseInt(selectedTemplate)
      );
      if (!template) {
        throw new Error("Selected template not found");
      }

      // Find the selected workout from the template
      const templateWorkout = template.templateWorkouts.find((tw) => {
        const workout = tw.workout || tw.userWorkout;
        return workout?.id === parseInt(selectedWorkout);
      });
      if (!templateWorkout) {
        throw new Error("Selected workout not found in template");
      }

      const workout = templateWorkout.workout || templateWorkout.userWorkout;
      const workoutId = workout?.id;
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
        date,
        "templateId:",
        template.id
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
            templateId: template.id, // Include templateId from selected template
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
      resetForm(); // Reset form after successful save
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed: " + error.message);
    }
  };

  return (
    <>
      <dialog id="add_entry_modal" className="modal">
        {
          <div className="modal-box w-11/12 max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
            <h3 className="font-extrabold text-center text-lg sm:text-xl">
              Add New Entry
            </h3>
            <form action="">
              <div className="flex flex-col gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Select Template:
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full text-base"
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    required
                  >
                    <option value="">Choose a template...</option>
                    {loading ? (
                      <option disabled>Loading templates...</option>
                    ) : (
                      userTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {selectedTemplate && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Select Workout:
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full text-base"
                      value={selectedWorkout}
                      onChange={(e) => setSelectedWorkout(e.target.value)}
                      required
                    >
                      <option value="">Choose a workout...</option>
                      {getTemplateWorkouts().map((templateWorkout) => {
                        // Handle both legacy workouts and new userWorkouts
                        const workout =
                          templateWorkout.workout ||
                          templateWorkout.userWorkout;
                        const workoutName = workout
                          ? templateWorkout.userWorkout?.customName ||
                            templateWorkout.userWorkout?.globalWorkout?.name ||
                            workout.name
                          : "Unknown Workout";

                        return (
                          <option
                            key={workout?.id || templateWorkout.id}
                            value={workout?.id || templateWorkout.id}
                          >
                            {workoutName} ({templateWorkout.sets} sets ×{" "}
                            {templateWorkout.reps} reps
                            {templateWorkout.amrap ? " + AMRAP" : ""})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Enter Date:</span>
                  </label>
                  <input
                    type="date"
                    name="add_date"
                    id="add_date"
                    className="input input-bordered w-full text-base"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Enter Weight (lbs):
                    </span>
                  </label>
                  <input
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => setWeight(Math.round(weight / 5) * 5)}
                    type="number"
                    name="add_weight"
                    id="add_weight"
                    className="input input-bordered w-full text-base"
                    pattern="[0-9]*"
                    value={weight}
                    placeholder="Enter weight in pounds"
                  />
                </div>
              </div>
            </form>
            <div className="modal-action m-0 mt-4">
              <form method="dialog">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                    onClick={resetForm}
                  >
                    Discard
                  </button>

                  <button
                    className={`btn w-full sm:w-auto px-6 order-1 sm:order-2 ${
                      selectedTemplate && selectedWorkout
                        ? "btn-primary"
                        : "btn-disabled"
                    }`}
                    onClick={saveWeight}
                    disabled={!selectedTemplate || !selectedWorkout}
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </dialog>
    </>
  );
};
