import { useState } from "react";
import { WorkoutAutocomplete } from "../WorkoutAutocomplete";

export function AutocompleteDemo() {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [query, setQuery] = useState("");

  const handleWorkoutSelect = (workout) => {
    console.log("Selected workout:", workout);

    // Add the workout to our list
    setSelectedWorkouts((prev) => {
      // Don't add duplicates
      if (prev.some((w) => w.name === workout.name)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: workout.id || `temp-${Date.now()}`,
          name: workout.name,
          category: workout.category,
          muscleGroup: workout.muscleGroup,
          equipment: workout.equipment,
          isCustom: workout.isCustom,
          sets: 3,
          reps: "8-12",
          amrap: false,
        },
      ];
    });

    // Clear the search
    setQuery("");
  };

  const removeWorkout = (workoutId) => {
    setSelectedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Smart Workout Autocomplete Demo
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Search and Add Workouts</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search for workouts
          </label>
          <WorkoutAutocomplete
            value={query}
            onChange={setQuery}
            onSelect={handleWorkoutSelect}
            placeholder="Start typing to search global workouts (e.g., 'bench press', 'squat', 'deadlift')..."
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            This autocomplete searches through a database of global workouts and
            allows you to create custom ones.
          </p>
        </div>

        {selectedWorkouts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">
              Selected Workouts ({selectedWorkouts.length})
            </h3>
            <div className="space-y-2">
              {selectedWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{workout.name}</span>
                      {workout.isCustom && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      {workout.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {workout.category}
                        </span>
                      )}
                      {workout.muscleGroup && (
                        <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                          {workout.muscleGroup}
                        </span>
                      )}
                      {workout.equipment && (
                        <span className="bg-green-100 px-2 py-1 rounded text-xs">
                          {workout.equipment}
                        </span>
                      )}
                      <span className="text-gray-500">
                        {workout.sets} sets × {workout.reps} reps
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeWorkout(workout.id)}
                    className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-white"
                    title="Remove workout"
                  >
                    <span className="material-icons text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Smart Search:</strong> Type workout names to find
              matches from the global database
            </li>
            <li>
              • <strong>Auto-suggestions:</strong> Real-time suggestions as you
              type with 300ms debouncing
            </li>
            <li>
              • <strong>Keyboard Navigation:</strong> Use arrow keys to
              navigate, Enter to select, Escape to close
            </li>
            <li>
              • <strong>Custom Creation:</strong> If no matches found, you can
              create custom workouts
            </li>
            <li>
              • <strong>Category Tags:</strong> See workout categories, muscle
              groups, and equipment at a glance
            </li>
            <li>
              • <strong>Duplicate Prevention:</strong> Won&apos;t add the same
              workout twice
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
