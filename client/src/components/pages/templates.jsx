import { useState } from "react";
import { Nav } from "../nav";
import { TemplateList } from "../templates/TemplateList";
import { CreateTemplateModal } from "../templates/CreateTemplateModal";
import { EditTemplateModal } from "../templates/EditTemplateModal";
import { DeleteTemplateModal } from "../templates/DeleteTemplateModal";
import { useTemplates } from "../templates/useTemplates";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export function Templates() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const {
    allTemplates,
    userTemplates,
    loading,
    reorderTemplates,
    refreshTemplates,
  } = useTemplates();

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

  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // Reorder the templates
    reorderTemplates(result.source.index, result.destination.index);
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
              <h2 className="text-lg font-semibold mb-4">Arrange Templates</h2>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder your templates. Default templates
                cannot be removed but can be repositioned.
              </p>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="templates">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {allTemplates.map((template, index) => (
                        <Draggable
                          key={
                            typeof template.id === "string"
                              ? template.id
                              : `t-${template.id}`
                          }
                          draggableId={
                            typeof template.id === "string"
                              ? template.id
                              : `t-${template.id}`
                          }
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-3 flex items-center"
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {template.name}
                                  {template.isDefault && (
                                    <span className="badge badge-sm ml-2">
                                      Default
                                    </span>
                                  )}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {template.workouts.length} workout
                                  {template.workouts.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <span className="material-icons text-gray-400">
                                  drag_handle
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">
                My Custom Templates
              </h2>
              <TemplateList
                templates={userTemplates}
                onEdit={(template) => {
                  setSelectedTemplate(template);
                  setIsEditModalOpen(true);
                }}
                onDelete={(template) => {
                  setSelectedTemplate(template);
                  setIsDeleteModalOpen(true);
                }}
              />
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
