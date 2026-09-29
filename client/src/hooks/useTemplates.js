import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../components/auth/authContext";
import { api } from "../utils/api";

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshTemplates = useCallback(async () => {
    if (!user) {
      setUserTemplates([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setUserTemplates(await api("/templates"));
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTemplates();
  }, [refreshTemplates]);

  return {
    userTemplates,
    loading,
    refreshTemplates,
  };
}
