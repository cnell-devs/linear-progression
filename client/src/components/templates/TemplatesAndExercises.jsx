/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateTemplateModal } from "./CreateTemplateModal";
import { EditTemplateModal } from "./EditTemplateModal";
import { DeleteTemplateModal } from "./DeleteTemplateModal";
import { RenameExerciseModal } from "../workouts/RenameExerciseModal";
import { DeleteExerciseModal } from "../workouts/DeleteExerciseModal";
import { useTemplates } from "../../hooks/useTemplates";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { api } from "../../utils/api";
import { workoutName } from "../../utils/workout-display";

const EmptyState = ({ icon, title, body, action }) => (
  <div className="rounded-lg border border-dashed p-8 text-center">
    <span className="material-icons mb-2 text-4xl opacity-30">{icon}</span>
    <p className="font-medium">{title}</p>
    <p className="mt-1 text-sm opacity-60">{body}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export function TemplatesAndExercises() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("templates");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { userTemplates, loading, refreshTemplates } = useTemplates();
  const {
    workouts,
    isLoading: workoutsLoading,
    fetchUserWorkouts,
    updateUserWorkout,
    deleteUserWorkout,
  } = useUserWorkouts();

  // Only workouts the user created themselves are editable here. Entries from
  // the shared global catalog aren't theirs to rename or delete.
  const customWorkouts = (workouts || []).filter((w) => !w.globalWorkoutId);

  const handleCreateTemplate = async (templateData) => {
    try {
      await api("/templates", { method: "POST", body: templateData });
      refreshTemplates();
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template: " + error.message);
    }
  };

  const handleEditTemplate = async (templateData) => {
    try {
      await api(`/templates/${selectedTemplate.id}`, {
        method: "PUT",
        body: templateData,
      });
      refreshTemplates();
      setIsEditOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template: " + error.message);
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      await api(`/templates/${selectedTemplate.id}`, { method: "DELETE" });
      refreshTemplates();
      setIsDeleteOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template: " + error.message);
    }
  };

  const handleRename = async (name) => {
    await updateUserWorkout(renameTarget.id, { name });
    setRenameTarget(null);
  };

  const handleDeleteExercise = async () => {
    await deleteUserWorkout(deleteTarget.id);
    setDeleteTarget(null);
    refreshTemplates(); // a deleted exercise drops out of its templates
  };

  return (
    <div>
      <div role="tablist" className="tabs tabs-boxed mb-4 bg-base-100">
        <button
          role="tab"
          className={`tab ${tab === "templates" ? "tab-active" : ""}`}
          onClick={() => setTab("templates")}
        >
          Templates
        </button>
        <button
          role="tab"
          className={`tab ${tab === "exercises" ? "tab-active" : ""}`}
          onClick={() => setTab("exercises")}
        >
          My Exercises
        </button>
      </div>

      {tab === "templates" && (
        <>
          <button
            className="btn btn-primary mb-4 w-full gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <span className="material-icons">add</span>
            Create Template
          </button>

          {loading ? (
            <div className="py-12 text-center opacity-60">Loading...</div>
          ) : userTemplates.length === 0 ? (
            <EmptyState
              icon="list_alt"
              title="No templates yet"
              body="A template is a reusable workout day — like Push, Pull, or Legs. Starting one prefills your sets."
              action={
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create your first template
                </button>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {userTemplates.map((template) => (
                <div
                  key={template.id}
                  className="card border border-base-300 bg-base-100 shadow-sm"
                >
                  <div className="card-body gap-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">{template.name}</h3>
                        <p className="truncate text-xs opacity-60">
                          {template.templateWorkouts?.length || 0} exercise
                          {(template.templateWorkouts?.length || 0) === 1
                            ? ""
                            : "s"}
                          {template.templateWorkouts?.length
                            ? ` · ${template.templateWorkouts
                                .map((tw) => workoutName(tw.userWorkout))
                                .join(", ")}`
                            : ""}
                        </p>
                      </div>

                      <div className="dropdown dropdown-end flex-none">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-sm btn-ghost btn-square"
                          aria-label={`Options for ${template.name}`}
                        >
                          <span className="material-icons">more_vert</span>
                        </div>
                        <ul
                          tabIndex={0}
                          className="menu dropdown-content z-20 w-44 rounded-box border bg-base-100 p-2 shadow"
                        >
                          <li>
                            <button
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsEditOpen(true);
                              }}
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="text-error"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsDeleteOpen(true);
                              }}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* The main thing you want from a template is to run it. */}
                    <button
                      className="btn btn-primary btn-sm w-full gap-1"
                      onClick={() =>
                        navigate(`/workout?template=${template.id}`)
                      }
                    >
                      <span className="material-icons text-base">
                        play_arrow
                      </span>
                      Start Workout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "exercises" && (
        <>
          <p className="mb-4 text-sm opacity-60">
            Exercises you created yourself. Add new ones while logging a workout
            or when building a template.
          </p>

          {workoutsLoading ? (
            <div className="py-12 text-center opacity-60">Loading...</div>
          ) : customWorkouts.length === 0 ? (
            <EmptyState
              icon="fitness_center"
              title="No custom exercises"
              body="Everything you use comes from the shared catalog. Type a new name when adding an exercise to create your own."
              action={
                <Link to="/workout" className="btn btn-primary btn-sm">
                  Go to Workout
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {customWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-base-300 bg-base-100 p-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{workout.name}</div>
                    <div className="text-xs opacity-60">
                      {workout.usage?.sets || 0} logged set
                      {workout.usage?.sets === 1 ? "" : "s"}
                      {workout.pendingApproval && (
                        <span className="badge badge-warning badge-xs ml-2">
                          Pending review
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="dropdown dropdown-end flex-none">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-sm btn-ghost btn-square"
                      aria-label={`Options for ${workout.name}`}
                    >
                      <span className="material-icons">more_vert</span>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content z-20 w-40 rounded-box border bg-base-100 p-2 shadow"
                    >
                      <li>
                        <button onClick={() => setRenameTarget(workout)}>
                          Rename
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-error"
                          onClick={() => setDeleteTarget(workout)}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <CreateTemplateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTemplate}
      />
      <EditTemplateModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTemplate(null);
        }}
        onSubmit={handleEditTemplate}
        template={selectedTemplate}
      />
      <DeleteTemplateModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedTemplate(null);
        }}
        onConfirm={handleDeleteTemplate}
        template={selectedTemplate}
      />

      <RenameExerciseModal
        workout={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRename}
      />
      <DeleteExerciseModal
        workout={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteExercise}
        onRefresh={fetchUserWorkouts}
      />
    </div>
  );
}
