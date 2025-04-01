export function TemplateList({ templates, onEdit, onDelete }) {
  if (!templates.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No templates found. Create your first template!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="card-body">
            <h2 className="card-title">{template.name}</h2>
            {template.description && (
              <p className="text-gray-600">{template.description}</p>
            )}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Workouts:</h3>
              <ul className="space-y-2">
                {template.workouts.map((workout) => (
                  <li key={workout.id} className="flex items-center gap-2">
                    <span className="material-icons text-sm">
                      fitness_center
                    </span>
                    <span>
                      {workout.name} ({workout.sets}x{workout.reps})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => onEdit(template)}
              >
                <span className="material-icons text-sm">edit</span>
              </button>
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={() => onDelete(template)}
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
