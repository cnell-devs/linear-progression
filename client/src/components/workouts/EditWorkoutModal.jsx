import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";

export function EditWorkoutModal({ isOpen, onClose, onSubmit, workout }) {
  const { user } = useAuth();
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

  const [isGlobalWorkout, setIsGlobalWorkout] = useState(false);
  const [makingPersonalCopy, setMakingPersonalCopy] = useState(false);

  useEffect(() => {
    if (workout) {
      // Initialize with workout data
      setFormData({
        name: workout.name || "",
        sets: workout.sets || 3,
        reps: workout.reps || "8-12",
        amrap: workout.amrap || false,
        type: workout.type || "push",
        alt: workout.alt || false,
        ss: workout.ss || false,
        isGlobal: workout.isGlobal || false,
      });

      // Determine if this is a global workout not owned by the current user
      setIsGlobalWorkout(
        workout.isGlobal && (!workout.userId || workout.userId !== user?.id)
      );
      setMakingPersonalCopy(false);
    }
  }, [workout, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // If user is editing a global workout and unchecks the global flag,
    // they're making a personal copy
    if (isGlobalWorkout && name === "isGlobal" && !checked) {
      setMakingPersonalCopy(true);
    } else if (name === "isGlobal" && checked) {
      setMakingPersonalCopy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(workout.id, {
      ...formData,
      sets: parseInt(formData.sets),
      isGlobal: user?.admin ? formData.isGlobal : false,
    });
  };

  if (!isOpen || !workout) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Workout</h2>

        {isGlobalWorkout && !user?.admin && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <p>
              {makingPersonalCopy
                ? "You're creating your own copy of this global workout."
                : "This is a global workout. Any changes will create your own personal copy."}
            </p>
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
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
