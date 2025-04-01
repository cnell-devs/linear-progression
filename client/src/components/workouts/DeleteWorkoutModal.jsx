export function DeleteWorkoutModal({ isOpen, onClose, onConfirm, workout }) {
  if (!isOpen || !workout) return null;

  const handleDelete = () => {
    onConfirm(workout.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete Workout</h2>
        <p className="mb-6">
          Are you sure you want to delete the workout "{workout.name}"? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
