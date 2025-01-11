/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";
import { useWorkout } from "./useWorkout";

export const EntryLog = ({ selected }) => {
  const [workoutLog, setWorkoutLog] = useState(false);
  const workouts = useWorkout("all");
  const { user } = useAuth();
//   console.log(workouts);

  useEffect(() => {
    const log = workouts?.map((workout) => ({
      id: workout.id,
      name: workout.name,
      entries: workout.weights,
    }));
    setWorkoutLog(log?.filter((entry) => entry?.id === selected?.id));
  }, [workouts, selected]);

    console.log(selected);

  return (
    !selected?.weights?.length == 0 && (
      <>
        <div className="overflow-x-auto">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Date</td>
                <td>Weight</td>
              </tr>
            </thead>
            <tbody>
              {workoutLog.map((entry, i) =>
                entry.entries.map((workout, z) => {
                  console.log(workout);

                  return (
                    <tr key={z}>
                      <th></th>
                      <td>{new Date(workout.date).toUTCString()}</td>
                      <td>{workout.weight}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td>Date</td>
                <td>Weight</td>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    )
  );
};
