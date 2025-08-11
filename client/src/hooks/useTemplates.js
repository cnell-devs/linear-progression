import { useState, useEffect } from "react";
import { useAuth } from "../components/auth/authContext";

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user templates
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

    if (user) {
      fetchUserTemplates();
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

  return {
    userTemplates,
    allTemplates: userTemplates, // Keep for compatibility
    loading,
    refreshTemplates,
  };
}
