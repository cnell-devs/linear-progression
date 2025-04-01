export function DeleteTemplateModal({ isOpen, onClose, onConfirm, template }) {
  if (!isOpen || !template) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Workout Template</h3>
        <p className="py-4">
          Are you sure you want to delete the template "{template.name}"? This
          action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
