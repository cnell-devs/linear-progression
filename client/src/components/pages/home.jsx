import { Link } from "react-router-dom";
import { Nav } from "../nav";
import { useTemplates } from "../templates/useTemplates";
import { useState } from "react";

export function Home() {
  const { allTemplates, loading } = useTemplates();
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <ul className="menu bg-base-200 rounded-box w-full mb-8">
            <li className="menu-title">Today's Split</li>
            <Link
              to="/exercises?defaultTemplate=default-push"
              className="flex mb-2"
            >
              <button className="btn flex-1">Push</button>
            </Link>
            <div className="flex mb-2">
              <button
                className="btn flex-1"
                onClick={() => setIsPullModalOpen(true)}
              >
                Pull
              </button>
            </div>
            <Link
              to="/exercises?defaultTemplate=default-legs"
              className="flex mb-2"
            >
              <button className="btn flex-1">Legs</button>
            </Link>
          </ul>

          <div className="bg-base-200 rounded-box p-4 w-full mb-8">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)}
            >
              <h2 className="text-xl font-bold">Workout Templates</h2>
              <span className="material-icons">
                {isTemplatesExpanded ? "expand_less" : "expand_more"}
              </span>
            </div>

            {isTemplatesExpanded && (
              <>
                {loading ? (
                  <div className="spinner-box mt-4">
                    <span className="material-icons animate-spin spinner text-4xl">
                      refresh
                    </span>
                  </div>
                ) : (
                  <div className="grid gap-3 mt-4">
                    {allTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="card-body p-4">
                          <h3 className="card-title text-lg">
                            {template.name}
                            {template.isDefault && (
                              <span className="badge badge-sm ml-2">
                                Default
                              </span>
                            )}
                          </h3>
                          {template.description && (
                            <p className="text-sm text-gray-500 mb-2">
                              {template.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {template.workouts.length} workout
                            {template.workouts.length !== 1 ? "s" : ""}
                          </p>
                          <div className="card-actions justify-end mt-2">
                            <Link
                              to={
                                template.isDefault
                                  ? `/exercises?defaultTemplate=${template.id}`
                                  : `/exercises?template=${template.id}`
                              }
                              className="btn btn-sm btn-primary"
                            >
                              Use Template
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pull Workout Selection Modal */}
      {isPullModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Choose Pull Workout</h3>
            <p className="py-4">
              Select the pull workout variation you want to do today.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/exercises?defaultTemplate=default-pull"
                className="btn btn-primary"
                onClick={() => setIsPullModalOpen(false)}
              >
                Primary
              </Link>
              <Link
                to="/exercises?defaultTemplate=default-pull-alt"
                className="btn btn-outline"
                onClick={() => setIsPullModalOpen(false)}
              >
                Alt
              </Link>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsPullModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsPullModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
