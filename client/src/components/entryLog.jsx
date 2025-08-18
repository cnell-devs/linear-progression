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
        {/* Desktop Table */}
        <div className="w-full hidden sm:block">
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
                        <td>{convertUtcToDateFormat(workout.date)}</td>

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

        {/* Mobile Cards */}
        <div className="w-full sm:hidden space-y-3">
          {workoutLog?.map((entry) =>
            entry.entries
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((workout, z) => {
                const templateName = workout.templateId
                  ? userTemplates.find((t) => t.id == workout.templateId)
                      ?.name || "Unknown"
                  : "None";

                return (
                  <div
                    key={z}
                    className="card bg-base-100 shadow-sm border p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">
                          {convertUtcToDateFormat(workout.date)}
                        </div>
                        <div className="text-lg font-bold mb-2">
                          {workout.weight} lbs
                        </div>
                        <span
                          className={`badge badge-sm ${
                            workout.templateId ? "badge-primary" : "badge-ghost"
                          }`}
                        >
                          {templateName}
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-ghost btn-square text-red-500"
                        onClick={() => {
                          document
                            .getElementById("delete_entry_modal")
                            .showModal();
                          setCurrentEntry(workout);
                        }}
                      >
                        <span className="material-icons text-lg">close</span>
                      </button>
                    </div>
                  </div>
                );
              })
          )}
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
