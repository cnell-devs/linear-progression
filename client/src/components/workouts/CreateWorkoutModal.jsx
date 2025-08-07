import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";

export function CreateWorkoutModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    alt: false,
    ss: false,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Modal just opened, keep current form state
    } else {
      // Reset form when closing
      setFormData({
        name: "",
        alt: false,
        ss: false,
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

    try {
      setIsSubmitting(true);

      // Prepare workout data with proper types
      const workoutData = {
        ...formData,
        userId: user?.id, // Explicitly include userId
      };

      console.log("Sending workout data:", workoutData);

      // Call the onSubmit prop with the form data
      await onSubmit(workoutData);

      console.log("Workout created successfully");

      // Reset form on successful submission
      setFormData({
        name: "",
        type: "push",
        alt: false,
        ss: false,
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

          <div className="flex space-x-4 mb-4">
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
