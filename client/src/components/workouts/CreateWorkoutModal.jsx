import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";

export function CreateWorkoutModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sets: 3,
    reps: "8-12",
    amrap: false,
    type: "push",
    alt: false,
    ss: false,
    isGlobal: false,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Modal just opened, keep current form state
    } else {
      // Reset form when closing
      setFormData({
        name: "",
        sets: 3,
        reps: "8-12",
        amrap: false,
        type: "push",
        alt: false,
        ss: false,
        isGlobal: false,
      });
      setError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted with data:", formData);

    // Validate form data
    if (!formData.name.trim()) {
      setError("Workout name is required");
      return;
    }

    if (isNaN(parseInt(formData.sets)) || parseInt(formData.sets) <= 0) {
      setError("Sets must be a positive number");
      return;
    }

    if (!formData.reps.trim()) {
      setError("Reps is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare workout data with proper types
      const workoutData = {
        ...formData,
        sets: parseInt(formData.sets),
        userId: user?.id, // Explicitly include userId
      };

      console.log("Sending workout data:", workoutData);

      // Call the onSubmit prop with the form data
      await onSubmit(workoutData);

      console.log("Workout created successfully");

      // Reset form on successful submission
      setFormData({
        name: "",
        sets: 3,
        reps: "8-12",
        amrap: false,
        type: "push",
        alt: false,
        ss: false,
        isGlobal: false,
      });

      // Close modal through the provided callback
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "Failed to create workout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Workout</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reps
              </label>
              <input
                type="text"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g. 8-12, 15"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="legs">Legs</option>
            </select>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="amrap"
                name="amrap"
                checked={formData.amrap}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="amrap" className="text-sm text-gray-700">
                AMRAP
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="alt"
                name="alt"
                checked={formData.alt}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="alt" className="text-sm text-gray-700">
                Alternate
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ss"
                name="ss"
                checked={formData.ss}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="ss" className="text-sm text-gray-700">
                Superset
              </label>
            </div>
          </div>

          {user && user.admin && (
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isGlobal"
                name="isGlobal"
                checked={formData.isGlobal}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isGlobal" className="text-sm text-gray-700">
                Make available to all users (Admin only)
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
