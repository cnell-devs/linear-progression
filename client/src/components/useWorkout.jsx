/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";

export const useWorkout = (params) => {
  const [workouts, setWorkouts] = useState(null);
  const { user } = useAuth();

  const fetchWorkouts = async () => {
    const url =
      params === "all"
        ? `${import.meta.env.VITE_API_URL}/workouts`
        : `${import.meta.env.VITE_API_URL}/workouts?split=${params.get(
            "split"
          )}&alt=${params.get("alt")}`;
    const response = await fetch(url);

    let data = await response.json();
    if (params == "all") {
      //pass
    } else if (params && !params.get("alt")) {
      const alternateIds = data
        .filter((workout) => workout.alternateId !== null)
        .map((workout) => workout.alternateId);

      data = data.filter((workout) => !alternateIds.includes(workout.id));
    } else {
      data = data.filter((workout) => !workout.alternateId);
    }

    if (user) {
      console.log('sorting');

      data.forEach((workout) => {
        workout.weights = workout?.weights.filter(
          (entry) => entry.userId == user.id
        );
      });
    }
    setWorkouts(data);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return {workouts, fetchWorkouts};
};
