// import { useAuth } from "../auth/authContext";
import { GraphWorkout } from "../graphWorkout";
import { useWorkout } from "../useWorkout";
import { Nav } from "../nav";
// import { useState } from "react";
import { PastWeek } from "../pastWeek";
import { DeleteModal } from "../deleteModal";

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
          <button
            className="absolute bottom-0 left-1/2 text-red-600"
            onClick={() => document.getElementById("my_modal").showModal()}
          >
            delete my account
          </button>

          <DeleteModal />
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
