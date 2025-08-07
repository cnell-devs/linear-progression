/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import { useAuth } from "./auth/authContext";

import { DeleteEntryModal } from "./deleteEntryModal";
import { convertUtcToDateFormat } from "../utils/date-formatter";

export const EntryLog = ({
  workouts,
  selected,
  fetchData,
  templateFilter,
  userTemplates,
}) => {
  const [workoutLog, setWorkoutLog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState();

  // const { workouts } = useWorkout("all");

  useEffect(() => {
    const log = workouts?.map((workout) => ({
      id: workout.id,
      name: workout.name,
      entries: workout.weights,
    }));

    let filteredLog = log?.filter((entry) => entry?.id === selected?.id);

    // Apply template filter to the entries
    if (filteredLog && templateFilter) {
      filteredLog = filteredLog.map((entry) => {
        let filteredEntries = entry.entries;

        if (templateFilter !== "all") {
          if (templateFilter === "none") {
            // Show only entries without a template
            filteredEntries = entry.entries.filter(
              (weight) =>
                weight.templateId === null || weight.templateId === undefined
            );
          } else {
            // Show only entries for specific template
            filteredEntries = entry.entries.filter(
              (weight) => weight.templateId == templateFilter
            );
          }
        }
        // If "all", show all entries (no additional filtering)

        return {
          ...entry,
          entries: filteredEntries,
        };
      });
    }

    setWorkoutLog(filteredLog);
  }, [workouts, selected, templateFilter]);

  return (
    !selected?.weights?.length == 0 && (
      <>
        <div className="w-full">
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Date</td>
                <td>Weight &#40;lbs&#41;</td>
                <td>Template</td>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workoutLog?.map((entry) =>
                entry.entries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((workout, z) => {
                    const templateName = workout.templateId
                      ? userTemplates.find((t) => t.id == workout.templateId)
                          ?.name || "Unknown"
                      : "None";

                    return (
                      <tr key={z} className="">
                        <th></th>
                        <td>
                          {convertUtcToDateFormat(
                            new Date(workout.date).toISOString()
                          )}
                        </td>

                        <td>{workout.weight}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              workout.templateId
                                ? "badge-primary"
                                : "badge-ghost"
                            }`}
                          >
                            {templateName}
                          </span>
                        </td>
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
                <td>Template</td>
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
