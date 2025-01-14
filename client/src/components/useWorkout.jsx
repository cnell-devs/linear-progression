import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";

export const useWorkout = (params) => {
  const [workouts, setWorkouts] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const url =
      params === "all"
        ? `${import.meta.env.VITE_API_URL}/workouts`
        : `${import.meta.env.VITE_API_URL}/workouts?split=${params.get(
            "split"
          )}&alt=${params.get("alt")}`;

    const fetchWorkouts = async () => {
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
        data.forEach((workout) => {
          workout.weights = workout?.weights.filter(
            (entry) => entry.userId == user.id
          )
        });
      }
      setWorkouts(data);
    };

    fetchWorkouts();
  }, [params, user]);

  return workouts;
};
