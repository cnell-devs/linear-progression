import { useEffect, useState } from "react";

export const useWorkout = (params) => {
  const [workouts, setWorkouts] = useState(null);

  useEffect(() => {
    const url =
      params === "all"
        ? "api/workouts"
        : `api/workouts?split=${params.get("split")}&alt=${params.get("alt")}`;


    const fetchWorkouts = async () => {
      const response = await fetch(url);
      //
      //    const response = await fetch(
      //   `api/workouts?split=${searchParams.get("split")}&alt=${searchParams.get(
      //     "alt"
      //   )}`
      // );

      let data = await response.json();
      if (params == "all") {
        //pass
      console.log("setting");

      } else if (params && !params.get("alt")) {
        const alternateIds = data
          .filter((workout) => workout.alternateId !== null)
          .map((workout) => workout.alternateId);

        data = data.filter((workout) => !alternateIds.includes(workout.id));
      } else {
        data = data.filter((workout) => !workout.alternateId);
      }

      setWorkouts(data);
    };

    fetchWorkouts();
  }, [params]);
  return workouts;
};
