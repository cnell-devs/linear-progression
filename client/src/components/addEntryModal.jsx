/* eslint-disable react/prop-types */
import { useAuth } from "./auth/authContext";
import { useState } from "react";

export const AddEntryModal = ({ selected, fetchData }) => {
  const { user } = useAuth();

  const [weight, setWeight] = useState(100);
  const [date, setDate] = useState(new Date());

  const saveWeight = async () => {
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
            workoutId: selected.id,
            date: date,
            weight: weight,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Post failed");
      }

      fetchData();
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed.", error);
    }
  };

  return (
    <>
      <dialog id="add_entry_modal" className="modal">
        {
          <div className="modal-box flex flex-col gap-6">
            <h3 className="font-extrabold text-center text-lg ">
              {selected?.name}
            </h3>
            {selected ? (
              <form action="">
                <label className="">
                  Enter Date: &nbsp;
                  <input
                    type="date"
                    name="add_date"
                    id="add_date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </label>
                <br />
                <label className="">
                  Enter Weight: &nbsp;
                  <input
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => setWeight(Math.round(weight / 5) * 5)}
                    type="number"
                    name="add_weight"
                    id="add_weight"
                    // step="5"
                    pattern="[0-9]*"
                    value={weight}
                  />
                </label>
              </form>
            ) : (
              <p className="flex justify-center font-bold">Select a Workout</p>
            )}
            <div className="modal-action m-0">
              <form method="dialog">
                <div className="flex gap-2">
                  <button className="btn">Discard</button>

                  {selected && (
                    <button
                      className="btn bg-blue-500 text-white px-6"
                      onClick={saveWeight}
                    >
                      save
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        }
      </dialog>
    </>
  );
};
