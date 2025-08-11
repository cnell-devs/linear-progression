import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../auth/authContext";

export function CreateWorkoutModalV2({ isOpen, onClose, onSubmit }) {
  useAuth(); // Keep auth context available even if not directly used
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGlobalWorkout, setSelectedGlobalWorkout] = useState(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    globalWorkoutId: null,
    alt: false,
    ss: false,
    muscleGroup: "",
    equipment: "",
    description: "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        globalWorkoutId: null,
        alt: false,
        ss: false,
        muscleGroup: "",
        equipment: "",
        description: "",
      });
      setError("");
      setSearchTerm("");
      setSearchResults([]);
      setSelectedGlobalWorkout(null);
      setShowMetadataForm(false);
    }
  }, [isOpen]);

  // Debounced search function
  const searchWorkouts = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/v2/workouts/global/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        console.error("Failed to search workouts");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching workouts:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchWorkouts(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchWorkouts]);

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData((prev) => ({ ...prev, name: value }));

    // Clear selection if user is typing something different
    if (selectedGlobalWorkout && value !== selectedGlobalWorkout.name) {
      setSelectedGlobalWorkout(null);
      setFormData((prev) => ({ ...prev, globalWorkoutId: null }));
    }
  };

  const handleSelectGlobalWorkout = (workout) => {
    setSelectedGlobalWorkout(workout);
    setSearchTerm(workout.name);
    setFormData((prev) => ({
      ...prev,
      name: workout.name,
      globalWorkoutId: workout.id,
      muscleGroup: workout.muscleGroup || "",
      equipment: workout.equipment || "",
    }));
    setSearchResults([]);
  };

  const handleCreateCustom = () => {
    setSelectedGlobalWorkout(null);
    setFormData((prev) => ({ ...prev, globalWorkoutId: null }));
    setShowMetadataForm(true);
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form data
    if (!formData.name.trim()) {
      setError("Workout name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare workout data
      const workoutData = {
        name: formData.name.trim(),
        alt: formData.alt,
        ss: formData.ss,
        ...(formData.globalWorkoutId && {
          globalWorkoutId: formData.globalWorkoutId,
        }),
        ...(formData.muscleGroup && { muscleGroup: formData.muscleGroup }),
        ...(formData.equipment && { equipment: formData.equipment }),
        ...(formData.description && { description: formData.description }),
      };

      console.log("Sending workout data:", workoutData);

      // Call the onSubmit prop with the form data
      await onSubmit(workoutData);

      console.log("Workout created successfully");
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
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Workout</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Workout Search/Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                className="w-full p-2 border rounded"
                placeholder="Start typing to search existing workouts..."
                required
              />

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((workout) => (
                    <div
                      key={workout.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSelectGlobalWorkout(workout)}
                    >
                      <div className="font-medium">{workout.name}</div>
                      <div className="text-sm text-gray-600">
                        {workout.muscleGroup && (
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">
                            {workout.muscleGroup}
                          </span>
                        )}
                        {workout.equipment && (
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {workout.equipment}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Option to create custom workout */}
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer border-t bg-gray-50"
                    onClick={handleCreateCustom}
                  >
                    <div className="font-medium text-blue-600">
                      + Create &quot;{searchTerm}&quot; as new workout
                    </div>
                    <div className="text-sm text-gray-600">
                      This will create a custom workout for you
                    </div>
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="absolute right-2 top-2">
                  <span className="material-icons animate-spin text-gray-400">
                    refresh
                  </span>
                </div>
              )}
            </div>

            {/* Selected Global Workout Info */}
            {selectedGlobalWorkout && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <div className="text-sm text-green-800">
                  ✓ Using global workout:{" "}
                  <strong>{selectedGlobalWorkout.name}</strong>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  This workout is shared across all users and will be
                  auto-updated if improved.
                </div>
              </div>
            )}
          </div>

          {/* Metadata Form for Custom Workouts */}
          {(showMetadataForm || (!selectedGlobalWorkout && searchTerm)) && (
            <div className="mb-4 p-4 bg-gray-50 border rounded">
              <h4 className="font-medium mb-3 text-gray-700">
                Help improve our database (optional)
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="">Select equipment</option>
                    <option value="barbell">Barbell</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="machine">Machine</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="cable">Cable</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Muscle Group
                  </label>
                  <input
                    type="text"
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="e.g., chest, back, shoulders"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  rows="2"
                  placeholder="Brief description of the exercise..."
                />
              </div>

              <div className="text-xs text-gray-600 mt-2">
                Providing this information helps us suggest this workout to
                other users.
              </div>
            </div>
          )}

          {/* Workout Options */}
          <div className="flex space-x-4 mb-6">
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

          {/* Action Buttons */}
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
              {isSubmitting ? "Creating..." : "Create Workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateWorkoutModalV2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
