import { useState, useEffect } from "react";
import { useWorkout } from "../useWorkout";

export function EditTemplateModal({ isOpen, onClose, onSubmit, template }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const { workouts } = useWorkout("all");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || "");
      setSelectedWorkouts(template.workouts);
    }
  }, [template]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setSelectedWorkouts([]);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedWorkouts.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      workoutIds: selectedWorkouts.map((workout) => workout.id),
    });
  };

  const toggleWorkout = (workout) => {
    setSelectedWorkouts((prev) => {
      const isSelected = prev.some((w) => w.id === workout.id);
      if (isSelected) {
        return prev.filter((w) => w.id !== workout.id);
      } else {
        return [...prev, workout];
      }
    });
  };

  if (!isOpen || !template) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Workout Template</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Template Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description (optional)"
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Select Workouts *</span>
            </label>
            <div className="max-h-60 overflow-y-auto">
              {workouts?.map((workout) => (
                <div
                  key={workout.id}
                  className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-base-200 rounded ${
                    selectedWorkouts.some((w) => w.id === workout.id)
                      ? "bg-base-200"
                      : ""
                  }`}
                  onClick={() => toggleWorkout(workout)}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedWorkouts.some((w) => w.id === workout.id)}
                    onChange={() => {}}
                  />
                  <span>
                    {workout.name} ({workout.sets}x{workout.reps})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
