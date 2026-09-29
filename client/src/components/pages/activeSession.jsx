/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Nav } from "../nav";
import { ExerciseCard } from "../session/ExerciseCard";
import { AddExerciseSheet } from "../session/AddExerciseSheet";
import { RestTimer } from "../session/RestTimer";
import { useSession } from "../../hooks/useSession";
import { useTemplates } from "../../hooks/useTemplates";
import { api } from "../../utils/api";
import {
  groupSetsByWorkout,
  formatDuration,
  workoutName,
} from "../../utils/workout-display";

// Template reps are free text ("8-12", "5", "AMRAP"); take the leading number
// as the prefilled target and fall back to 0 when there isn't one.
const parseTargetReps = (reps) => {
  const match = String(reps ?? "").match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const StartScreen = ({ templates, loading, onStart, starting }) => (
  <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
    <h1 className="mb-1 text-2xl font-bold">Start a Workout</h1>
    <p className="mb-6 text-sm opacity-60">
      Pick a template to prefill your sets, or start empty and add exercises as
      you go.
    </p>

    <button
      className="btn btn-primary mb-6 w-full gap-2"
      onClick={() => onStart({})}
      disabled={starting}
    >
      <span className="material-icons">add</span>
      Start Empty Workout
    </button>

    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide opacity-50">
      From Template
    </h2>

    {loading && <div className="py-6 text-center opacity-60">Loading...</div>}

    {!loading && templates.length === 0 && (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm opacity-60">
        No templates yet. Create one from the Templates page to prefill your
        workouts.
      </div>
    )}

    <div className="flex flex-col gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          className="card border border-base-300 bg-base-100 p-4 text-left shadow-sm transition hover:border-primary disabled:opacity-50"
          onClick={() => onStart({ templateId: template.id, name: template.name })}
          disabled={starting}
        >
          <div className="font-bold">{template.name}</div>
          <div className="mt-1 truncate text-xs opacity-60">
            {template.templateWorkouts?.length || 0} exercises
            {template.templateWorkouts?.length
              ? ` · ${template.templateWorkouts
                  .map((tw) => workoutName(tw.userWorkout))
                  .join(", ")}`
              : ""}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export function ActiveSession() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    session,
    loading,
    startSession,
    addSet,
    updateSet,
    deleteSet,
    finishSession,
    discardSession,
    reload,
    online,
    pending,
  } = useSession();
  const { userTemplates, loading: templatesLoading } = useTemplates();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const [restDuration, setRestDuration] = useState(90);
  const [, forceTick] = useState(0);

  // Keeps the header's elapsed-time readout moving without a timer per card.
  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [session]);

  const groups = useMemo(
    () => groupSetsByWorkout(session?.sets || []),
    [session]
  );

  const totalSets = session?.sets?.filter((s) => s.completed).length || 0;

  const handleStart = async ({ templateId, name }) => {
    setStarting(true);
    try {
      const created = await startSession({ templateId, name });

      // Prefill a row per prescribed set so the user only types numbers.
      if (templateId) {
        const template = userTemplates.find((t) => t.id === templateId);
        for (const tw of template?.templateWorkouts || []) {
          if (!tw.userWorkoutId) continue;
          const last = await api(
            `/sessions/last/${tw.userWorkoutId}?excludeSession=${created.id}`
          ).catch(() => null);

          for (let i = 0; i < (tw.sets || 1); i++) {
            await addSet(created.id, {
              userWorkoutId: tw.userWorkoutId,
              setNumber: i + 1,
              weight: last?.sets?.[i]?.weight ?? last?.sets?.[0]?.weight ?? 0,
              reps: last?.sets?.[i]?.reps ?? parseTargetReps(tw.reps),
              completed: false,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Could not start workout: " + error.message);
    } finally {
      setStarting(false);
    }
  };

  const handleToggleComplete = async (set, values) => {
    await updateSet(set.clientId, values);
    // Start resting only when checking a set off, not when un-checking it.
    if (values.completed) setRestTimer({ startedAt: Date.now() });
  };

  const handleRemoveExercise = async (group) => {
    for (const set of group.sets) {
      await deleteSet(set.clientId);
    }
  };

  const handleFinish = async () => {
    if (!totalSets) {
      alert("Log at least one set before finishing.");
      return;
    }
    try {
      await finishSession(session.id);
      setRestTimer(null);
      setSearchParams({});
    } catch (error) {
      console.error("Failed to finish session:", error);
      alert("Could not finish workout: " + error.message);
    }
  };

  const handleDiscard = async () => {
    try {
      await discardSession(session.id);
      setRestTimer(null);
    } catch (error) {
      console.error("Failed to discard session:", error);
    }
  };

  // Auto-start from a template when navigated to with ?template=<id>.
  useEffect(() => {
    const templateId = searchParams.get("template");
    if (!templateId || loading || session || starting || templatesLoading)
      return;
    const template = userTemplates.find((t) => t.id === parseInt(templateId));
    if (!template) return;
    setSearchParams({}, { replace: true });
    handleStart({ templateId: template.id, name: template.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loading, session, starting, templatesLoading, userTemplates]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="spinner-box">
          <span className="material-icons animate-spin spinner text-6xl">
            refresh
          </span>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Nav />
        <StartScreen
          templates={userTemplates}
          loading={templatesLoading}
          onStart={handleStart}
          starting={starting}
        />
      </>
    );
  }

  return (
    <>
      <Nav />

      {/* Live session summary, pinned so stats stay visible while scrolling. */}
      <div className="sticky top-0 z-20 border-b bg-base-100/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">
                {session.name || "Workout"}
              </h1>
              {/* Session totals only. Averaging across different exercises
                  blends squats with lateral raises, so the average lives on
                  each exercise card instead. */}
              <div className="flex items-center gap-3 text-xs opacity-60">
                <span>{formatDuration(session.startedAt)}</span>
                <span>
                  {totalSets} set{totalSets === 1 ? "" : "s"}
                </span>
                {/* Sets are saved on the device first, so losing signal is
                    informational rather than an error. */}
                {!online ? (
                  <span
                    className="flex items-center gap-1 text-warning"
                    title="Saved on this device — will sync when you're back online"
                  >
                    <span className="material-icons text-sm">cloud_off</span>
                    Offline
                  </span>
                ) : pending ? (
                  <span
                    className="flex items-center gap-1"
                    title="Saving to your account"
                  >
                    <span className="material-icons text-sm">cloud_sync</span>
                    Saving
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 text-success"
                    title="Saved to your account"
                  >
                    <span className="material-icons text-sm">cloud_done</span>
                    Saved
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-none gap-2">
              <button className="btn btn-sm btn-primary" onClick={handleFinish}>
                Finish
              </button>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-ghost btn-square"
                  aria-label="Workout options"
                >
                  <span className="material-icons">more_vert</span>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-30 w-44 rounded-box border bg-base-100 p-2 shadow"
                >
                  <li>
                    <button onClick={reload}>Refresh</button>
                  </li>
                  <li>
                    <button className="text-error" onClick={handleDiscard}>
                      Discard workout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-3 pb-40 pt-3">
        {groups.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-60">
            No exercises yet. Add one to start logging sets.
          </div>
        )}

        {groups.map((group) => (
          <ExerciseCard
            key={group.userWorkoutId}
            group={group}
            sessionId={session.id}
            onAddSet={(data) => addSet(session.id, data)}
            onUpdateSet={updateSet}
            onToggleComplete={handleToggleComplete}
            onDeleteSet={deleteSet}
            onRemoveExercise={handleRemoveExercise}
          />
        ))}

        <button
          className="btn btn-outline btn-primary w-full gap-2"
          onClick={() => setSheetOpen(true)}
        >
          <span className="material-icons">add</span>
          Add Exercise
        </button>
      </div>

      {restTimer && (
        <RestTimer
          startedAt={restTimer.startedAt}
          duration={restDuration}
          onDismiss={() => setRestTimer(null)}
          onSetDuration={setRestDuration}
        />
      )}

      <AddExerciseSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        excludeIds={groups.map((g) => g.userWorkoutId)}
        onSelect={(workout) =>
          // A fresh exercise gets one empty row so there's something to type into.
          addSet(session.id, {
            userWorkoutId: workout.id,
            setNumber: 1,
            weight: 0,
            reps: 0,
            completed: false,
          })
        }
      />
    </>
  );
}
