import { useState } from "react";
import { Nav } from "../nav";
import { CreateTemplateModal } from "../templates/CreateTemplateModal";
import { EditTemplateModal } from "../templates/EditTemplateModal";
import { DeleteTemplateModal } from "../templates/DeleteTemplateModal";
import { useTemplates } from "../../hooks/useTemplates";

export function Templates() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { userTemplates, loading, refreshTemplates } = useTemplates();

  const handleCreateTemplate = async (templateData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(templateData),
        }
      );

      if (!response.ok) throw new Error("Failed to create template");

      refreshTemplates();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template");
    }
  };

  const handleEditTemplate = async (templateData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates/${selectedTemplate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(templateData),
        }
      );

      if (!response.ok) throw new Error("Failed to update template");

      refreshTemplates();
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template");
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates/${selectedTemplate.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete template");

      refreshTemplates();
      setIsDeleteModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workout Templates</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Template
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="material-icons animate-spin spinner text-4xl">
              refresh
            </span>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Templates</h2>
              <p className="text-sm text-gray-600 mb-4">
                Templates are ordered by most recently updated.
              </p>

              <div className="space-y-2">
                {userTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-3 flex items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-xs text-gray-500">
                        {template.templateWorkouts?.length || 0} workout
                        {(template.templateWorkouts?.length || 0) !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <button
                        className="btn btn-sm btn-ghost btn-square"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsEditModalOpen(true);
                        }}
                        title="Edit template"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button
                        className="btn btn-sm btn-ghost btn-square text-error"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete template"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <CreateTemplateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTemplate}
        />

        <EditTemplateModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
          }}
          onSubmit={handleEditTemplate}
          template={selectedTemplate}
        />

        <DeleteTemplateModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTemplate(null);
          }}
          onConfirm={handleDeleteTemplate}
          template={selectedTemplate}
        />
      </div>
    </>
  );
}
