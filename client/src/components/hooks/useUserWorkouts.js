import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/authContext";

export const useUserWorkouts = (filters = {}) => {
  const [workouts, setWorkouts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserWorkouts = useCallback(async () => {
    if (!user) {
      setWorkouts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);

      const queryString = params.toString();
      const url = `${apiUrl}/v2/workouts${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching user workouts from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched user workouts:", data);

      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching user workouts:", error);
      setError(error.message);
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters.category]);

  const createUserWorkout = async (workoutData) => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      console.log("Creating user workout:", workoutData);

      const response = await fetch(`${apiUrl}/v2/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to create workout: ${response.status}`
        );
      }

      const createdWorkout = await response.json();
      console.log("Created user workout:", createdWorkout);

      // Refresh the workouts list
      await fetchUserWorkouts();

      return createdWorkout;
    } catch (error) {
      console.error("Error creating user workout:", error);
      throw error;
    }
  };

  const updateUserWorkout = async (id, updateData) => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/v2/workouts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to update workout: ${response.status}`
        );
      }

      const updatedWorkout = await response.json();

      // Refresh the workouts list
      await fetchUserWorkouts();

      return updatedWorkout;
    } catch (error) {
      console.error("Error updating user workout:", error);
      throw error;
    }
  };

  const deleteUserWorkout = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/v2/workouts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete workout: ${response.status}`
        );
      }

      // Refresh the workouts list
      await fetchUserWorkouts();
    } catch (error) {
      console.error("Error deleting user workout:", error);
      throw error;
    }
  };

  const addWeight = async (
    userWorkoutId,
    weight,
    date = null,
    templateId = null
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/v2/workouts/weights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userWorkoutId,
          weight,
          date: date || new Date().toISOString(),
          ...(templateId && { templateId }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to add weight: ${response.status}`
        );
      }

      const weightEntry = await response.json();

      // Refresh the workouts list to get updated weights
      await fetchUserWorkouts();

      return weightEntry;
    } catch (error) {
      console.error("Error adding weight entry:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUserWorkouts();
  }, [fetchUserWorkouts]); // Re-fetch when fetchUserWorkouts changes

  return {
    workouts,
    isLoading,
    error,
    fetchUserWorkouts,
    createUserWorkout,
    updateUserWorkout,
    deleteUserWorkout,
    addWeight,
  };
};

// Hook for global workouts search and browsing
export const useGlobalWorkouts = () => {
  const [globalWorkouts, setGlobalWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchGlobalWorkouts = async (query, limit = 10) => {
    if (!query.trim()) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(
        `${apiUrl}/v2/workouts/global/search?q=${encodeURIComponent(
          query
        )}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search workouts: ${response.status}`);
      }

      const results = await response.json();
      return results;
    } catch (error) {
      console.error("Error searching global workouts:", error);
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGlobalWorkouts = async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.muscleGroup)
        params.append("muscleGroup", filters.muscleGroup);
      if (filters.equipment) params.append("equipment", filters.equipment);

      const queryString = params.toString();
      const url = `${apiUrl}/v2/workouts/global${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch global workouts: ${response.status}`);
      }

      const data = await response.json();
      setGlobalWorkouts(data);
      return data;
    } catch (error) {
      console.error("Error fetching global workouts:", error);
      setError(error.message);
      setGlobalWorkouts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    globalWorkouts,
    isLoading,
    error,
    searchGlobalWorkouts,
    fetchGlobalWorkouts,
  };
};
