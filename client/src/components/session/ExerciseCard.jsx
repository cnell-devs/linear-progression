/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { SetRow } from "./SetRow";
import { api } from "../../utils/api";
import { averageWeight, formatWeight } from "../../utils/workout-display";
import { convertUtcToDateFormat } from "../../utils/date-formatter";

// One exercise inside the active session: its set rows, the "last time"
// reference pulled from the previous session, and the add-set control.
export const ExerciseCard = ({
  group,
  sessionId,
  onAddSet,
  onUpdateSet,
  onToggleComplete,
  onDeleteSet,
  onRemoveExercise,
}) => {
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api(
      `/sessions/last/${group.userWorkoutId}?excludeSession=${sessionId}`
    )
      .then((data) => {
        if (!cancelled) setPrevious(data);
      })
      .catch((err) => console.error("Failed to load last performance:", err));
    return () => {
      cancelled = true;
    };
  }, [group.userWorkoutId, sessionId]);

  const completedSets = group.sets.filter((s) => s.completed && !s.isWarmup);
  const avgWeight = averageWeight(group.sets);

  // "Previous" lists working sets only, so a warm-up row must not consume a
  // slot — otherwise every reference shifts down by one.
  let workingIndex = -1;
  const rows = group.sets.map((set, index) => {
    if (!set.isWarmup) workingIndex += 1;
    return {
      set,
      index,
      previousSet: set.isWarmup ? null : previous?.sets?.[workingIndex],
    };
  });

  // Sets are ordered by setNumber, and rows can now be deleted from anywhere,
  // so numbering can have gaps. Derive the next one from the highest in use
  // rather than the count, which would collide after a middle row is removed.
  const nextSetNumber =
    group.sets.reduce((max, s) => Math.max(max, s.setNumber), 0) + 1;

  const addSet = () => {
    // Seed the new row from the last working set performed, which is almost
    // always what they want for a straight-set scheme. A warm-up would seed a
    // misleadingly light weight.
    const lastWorking = [...group.sets].reverse().find((s) => !s.isWarmup);
    const seed =
      lastWorking || previous?.sets?.[workingIndex + 1] || previous?.sets?.[0];

    onAddSet({
      userWorkoutId: group.userWorkoutId,
      setNumber: nextSetNumber,
      weight: seed?.weight ?? 0,
      reps: seed?.reps ?? 0,
      completed: false,
    });
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-primary">
              {group.name}
            </h3>
            {/* Rendered only when there is something to say, so the title
                stays centered against the menu button before any set is
                checked off. */}
            {completedSets.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 text-xs opacity-60">
                <span>
                  {completedSets.length} set
                  {completedSets.length === 1 ? "" : "s"} ·{" "}
                  {formatWeight(avgWeight)} avg
                </span>
              </div>
            )}
          </div>

          <div className="dropdown dropdown-end flex-none">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost btn-square"
              aria-label={`Options for ${group.name}`}
            >
              <span className="material-icons">more_vert</span>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-20 w-52 rounded-box border bg-base-100 p-2 shadow"
            >
              <li>
                <button
                  onClick={() =>
                    onAddSet({
                      userWorkoutId: group.userWorkoutId,
                      setNumber: nextSetNumber,
                      weight: 0,
                      reps: 0,
                      isWarmup: true,
                      completed: false,
                    })
                  }
                >
                  Add warm-up set
                </button>
              </li>
              <li>
                <button
                  className="text-error"
                  onClick={() => onRemoveExercise(group)}
                >
                  Remove exercise
                </button>
              </li>
            </ul>
          </div>
        </div>

        {previous?.session && (
          <div className="text-xs opacity-50">
            Last time · {convertUtcToDateFormat(previous.session.date)}
          </div>
        )}

        <div className="grid grid-cols-[1.5rem_0.8fr_1fr_1fr_2.25rem_1.75rem] gap-1.5 px-1 text-[0.65rem] font-bold uppercase tracking-wide opacity-50">
          <div className="text-center">Set</div>
          <div className="text-center">Previous</div>
          <div className="text-center">Lbs</div>
          <div className="text-center">Reps</div>
          <div />
          <div />
        </div>

        <div className="flex flex-col gap-1">
          {rows.map(({ set, index, previousSet }) => (
            <SetRow
              key={set.id}
              set={set}
              index={index}
              previous={previousSet}
              onCommit={(patch) => onUpdateSet(set.id, patch)}
              onToggleComplete={(values) =>
                onToggleComplete(set, { ...values, completed: !set.completed })
              }
              onDelete={() => onDeleteSet(set.id)}
            />
          ))}
        </div>

        <button className="btn btn-sm btn-ghost w-full gap-1" onClick={addSet}>
          <span className="material-icons text-base">add</span>
          Add Set
        </button>
      </div>
    </div>
  );
};
