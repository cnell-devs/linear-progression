import { Nav } from "../nav";
import { Workout } from "../workout";
import { useSearchParams } from "react-router-dom";
import { useWorkout } from "../useWorkout";
import { useState, useEffect } from "react";
import { defaultTemplates } from "../templates/defaultTemplates";

export function Exercises() {
  const [searchParams] = useSearchParams();
  const { workouts } = useWorkout(searchParams);
  const [templateInfo, setTemplateInfo] = useState(null);

  const showDivider = (index) => !(workouts && index == workouts.length - 1);

  useEffect(() => {
    // Check for default template parameter
    const defaultTemplateId = searchParams.get("defaultTemplate");
    if (defaultTemplateId) {
      const template = defaultTemplates.find((t) => t.id === defaultTemplateId);
      if (template) {
        setTemplateInfo(template);
      }
      return;
    }

    // If we're using a user template, fetch the template info
    const fetchTemplateInfo = async () => {
      const templateId = searchParams.get("template");
      if (!templateId) return;

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/templates/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch template info");
        const data = await response.json();
        setTemplateInfo(data);
      } catch (error) {
        console.error("Error fetching template info:", error);
      }
    };

    fetchTemplateInfo();
  }, [searchParams]);

  return (
    <>
      <Nav workouts={workouts} />

      {templateInfo && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold">
              {templateInfo.name}
              {templateInfo.isDefault && (
                <span className="badge badge-sm ml-2">Default</span>
              )}
            </h2>
            {templateInfo.description && (
              <p className="text-gray-500 mt-1">{templateInfo.description}</p>
            )}
          </div>
        </div>
      )}

      {workouts ? (
        <div className="pb-8">
          {workouts.map((workout, index) => {
            return (
              <div key={index}>
                <Workout workout={workout} />
                {showDivider(index) && <div className="divider"></div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="spinner-box">
          <span className="material-icons animate-spin spinner text-6xl">
            refresh
          </span>
        </div>
      )}
    </>
  );
}
