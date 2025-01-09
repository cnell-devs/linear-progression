import { useState } from "react";
import { useAuth } from "./auth/authContext";

/* eslint-disable react/prop-types */
export const Workout = ({ workout }) => {
    const { user } = useAuth();

    if (workout.weights.length) {

        var lastWeight = workout.weights.filter(
          (entry) => entry.userId == user.id
        ).length - 1;


        // console.log(
        //   "LASTWEIGHT",
        //  lastWeight
        // );

    }

        const [weight, setWeight] = useState(workout.weights.length ? Number(workout.weights.filter(entry => entry.userId == user.id)[lastWeight].weight) :  100);




  const increaseTopSet = () => setWeight(weight + 5);
  const decreaseTopSet = () => setWeight(weight ? weight - 5 : 0);

// console.log(user);

  const saveWeight = async () => {
    try {
      const response = await fetch("/api/weight-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          workoutId: workout.id,
          weight: weight,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      } else {
        // console.log(response);
      }
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed.");
    }
  };

  return (
    <>
      <div
        className={`flex justify-between items-center ${
          workout.supersettedId ? "ml-5" : ""
        }`}
      >
        <div>
          {workout.supersettedId && "SS"}
          <div>{workout.name}</div>
          <div>
            {workout.sets}x{workout.reps}
            {workout.amrap && " - Last Set AMRAP"}
          </div>
          <div>Top Set: {weight}</div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2">
          <button
            onClick={increaseTopSet}
            className="material-icons btn bg-transparent border-none shadow-none text-3xl font-normal"
          >
            add
          </button>
          <button
            onClick={decreaseTopSet}
            className="material-icons btn bg-transparent border-none shadow-none text-3xl font-normal"
          >
            remove
          </button>
          <button className="btn col-span-2" onClick={saveWeight}>
            save
          </button>
        </div>
      </div>
    </>
  );
};
