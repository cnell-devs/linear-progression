// import { useAuth } from "../auth/authContext";
import { GraphWorkout } from "../graphWorkout";
import { useWorkout } from "../useWorkout";
import { Nav } from "../nav";
// import { useState } from "react";
import { PastWeek } from "../pastWeek";

export const Profile = () => {
  // const { user } = useAuth();
  const workouts = useWorkout("all");

  return (
    <>
      <Nav />
      {workouts ? (
        <div className="flex flex-col gap-8">
          <PastWeek workouts={workouts} />
          <GraphWorkout workouts={workouts} />
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
};
