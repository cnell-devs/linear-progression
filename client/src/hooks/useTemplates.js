import { useState, useEffect } from "react";
import { useAuth } from "../components/auth/authContext";

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useState([]);
  const [templateOrder, setTemplateOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user templates and preferences
  useEffect(() => {
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

    if (user) {
      fetchUserTemplates();
      fetchUserPreferences();
    } else {
      // If not logged in, no templates available
      setUserTemplates([]);
      setLoading(false);
    }
  }, [user]);

  const refreshTemplates = async () => {
    if (!user) return;

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

  // Order templates based on saved order
  const orderedTemplates = () => {
    if (templateOrder.length > 0) {
      let ordered = [];

      // First add templates in the saved order
      for (const id of templateOrder) {
        const template = userTemplates.find((t) => t.id === Number(id));
        if (template) {
          ordered.push(template);
        }
      }

      // Then add any templates that aren't in the saved order
      userTemplates.forEach((template) => {
        if (!templateOrder.includes(template.id.toString())) {
          ordered.push(template);
        }
      });

      return ordered;
    }

    return userTemplates;
  };

  const reorderTemplates = (startIndex, endIndex) => {
    const currentTemplates = orderedTemplates();
    const result = Array.from(currentTemplates);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Extract IDs for the new order
    const newOrder = result.map((template) => template.id.toString());

    // Save the new order
    saveTemplateOrder(newOrder);

    return result;
  };

  return {
    userTemplates: orderedTemplates(),
    allTemplates: orderedTemplates(), // Keep for compatibility
    loading,
    reorderTemplates,
    refreshTemplates,
  };
}
