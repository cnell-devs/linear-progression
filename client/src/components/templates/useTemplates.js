import { useState, useEffect } from "react";
import { defaultTemplates } from "./defaultTemplates";
import { useAuth } from "../auth/authContext";

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [templateOrder, setTemplateOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user templates and preferences
  useEffect(() => {
    if (user) {
      fetchUserTemplates();
      fetchUserPreferences();
    } else {
      // If not logged in, just use default templates
      setAllTemplates([...defaultTemplates]);
      setLoading(false);
    }
  }, [user]);

  // Update the combined, ordered templates whenever templates or order changes
  useEffect(() => {
    if (userTemplates.length > 0 || defaultTemplates.length > 0) {
      let orderedTemplates = [];

      // If we have a saved template order
      if (templateOrder.length > 0) {
        // First add templates in the saved order
        for (const id of templateOrder) {
          // Check if it's a default template
          const defaultTemplate = defaultTemplates.find((t) => t.id === id);
          if (defaultTemplate) {
            orderedTemplates.push(defaultTemplate);
            continue;
          }

          // Check if it's a user template
          const userTemplate = userTemplates.find((t) => t.id === Number(id));
          if (userTemplate) {
            orderedTemplates.push(userTemplate);
          }
        }

        // Then add any templates that aren't in the saved order
        // First defaults
        defaultTemplates.forEach((template) => {
          if (!templateOrder.includes(template.id)) {
            orderedTemplates.push(template);
          }
        });

        // Then user templates
        userTemplates.forEach((template) => {
          if (!templateOrder.includes(template.id.toString())) {
            orderedTemplates.push(template);
          }
        });
      } else {
        // No saved order, just combine defaults first, then user templates
        orderedTemplates = [...defaultTemplates, ...userTemplates];
      }

      setAllTemplates(orderedTemplates);
    }
  }, [userTemplates, templateOrder]);

  const fetchUserTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/templates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setUserTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch preferences");

      const data = await response.json();
      if (data.templateOrder) {
        setTemplateOrder(JSON.parse(data.templateOrder));
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const saveTemplateOrder = async (newOrder) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `${import.meta.env.VITE_API_URL}/preferences/template-order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ templateOrder: newOrder }),
        }
      );

      setTemplateOrder(newOrder);
    } catch (error) {
      console.error("Error saving template order:", error);
    }
  };

  const reorderTemplates = (startIndex, endIndex) => {
    const result = Array.from(allTemplates);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Extract IDs for the new order
    const newOrder = result.map((template) =>
      typeof template.id === "number" ? template.id.toString() : template.id
    );

    // Save the new order
    saveTemplateOrder(newOrder);

    return result;
  };

  return {
    userTemplates,
    allTemplates,
    loading,
    reorderTemplates,
    refreshTemplates: fetchUserTemplates,
  };
}
