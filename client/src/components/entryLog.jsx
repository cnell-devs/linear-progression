/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import { useAuth } from "./auth/authContext";

import { DeleteEntryModal } from "./deleteEntryModal";

export const EntryLog = ({ workouts, selected, fetchData }) => {
  const [workoutLog, setWorkoutLog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState();

  // const { workouts } = useWorkout("all");

  useEffect(() => {
    const log = workouts?.map((workout) => ({
      id: workout.id,
      name: workout.name,
      entries: workout.weights,
    }));
    setWorkoutLog(log?.filter((entry) => entry?.id === selected?.id));
  }, [workouts, selected]);

  return (
    !selected?.weights?.length == 0 && (
      <>
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Date</td>
                <td>Weight &#40;lbs&#41;</td>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workoutLog?.map((entry) =>
                entry.entries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((workout, z) => {
                    return (
                      <tr key={z} className="">
                        <th></th>
                        <td>
                          {new Date(workout.date).toLocaleDateString("en-US", {
                            timeZone: "America/New_York",
                          })}
                        </td>

                        <td>{workout.weight}</td>
                        <td>
                          <button
                            className="material-icons text-red-500 font-bold w-full text-right"
                            onClick={() => {
                              document
                                .getElementById("delete_entry_modal")
                                .showModal();
                              setCurrentEntry(workout);
                            }}
                          >
                            close_small
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td>Date</td>
                <td>Weight &#40;lbs&#41;</td>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <DeleteEntryModal
          entry={currentEntry}
          selected={selected}
          fetchData={fetchData}
        />
      </>
    )
  );
};
