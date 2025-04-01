import { useState } from "react";
import { useAuth } from "./auth/authContext";

/* eslint-disable react/prop-types */
export const Workout = ({ workout }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ensure weights is always an array, even if undefined in workout object
  const weights = workout.weights || [];

  let lastWeight;
  if (weights.length && user) {
    const userWeights = weights.filter((entry) => entry.userId == user?.id);
    lastWeight = userWeights.length > 0 ? userWeights.length - 1 : undefined;
  }

  const [weight, setWeight] = useState(
    user && weights.length
      ? weights
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .filter((entry) => entry.userId == user?.id)[lastWeight]?.weight ||
          100
      : 100
  );

  const increaseTopSet = () => setWeight(Number(weight) + 5);
  const decreaseTopSet = () =>
    setWeight(Number(weight) ? Number(weight) - 5 : 0);

  const saveWeight = async () => {
    if (!saved) {
      setSaving(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/weight-entry`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              workoutId: workout.id,
              weight: weight,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Post failed");
        } else {
          setSaving(false);
          setSaved(true);
        }
      } catch (error) {
        setSaving(false);
        console.error("Save failed", error);
        alert("Save failed.");
      }
    } else {
      setSaved(false);
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
          {user && <div>Top Set: {weight}</div>}
        </div>
        {user && (
          <div className="grid grid-cols-2 grid-rows-2">
            {!saved && (
              <>
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
              </>
            )}
            <button
              className={`btn col-span-2 ${
                saved ? "row-span-2 bg-green-300" : ""
              }`}
              onClick={saveWeight}
            >
              {!saving ? (
                !saved ? (
                  "save"
                ) : (
                  "done ✅"
                )
              ) : (
                <div className="spinner-box">
                  <span className="material-icons animate-spin spinner text-xl">
                    refresh
                  </span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
