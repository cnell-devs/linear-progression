// Default workout templates for the application

export const defaultTemplates = [
  {
    id: "default-push",
    name: "Push",
    description:
      "Default push workout focusing on chest, shoulders, and triceps",
    workouts: [
      {
        id: "push-1",
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        type: "push",
        dbId: 3,
      },
      {
        id: "push-2",
        name: "Overhead Press",
        sets: 3,
        reps: "8-12",
        type: "push",
        dbId: 4,
      },
      {
        id: "push-3",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-12",
        type: "push",
        dbId: 5,
      },
      {
        id: "push-4",
        name: "Tricep Pushdowns",
        sets: 3,
        reps: "8-12",
        type: "push",
        dbId: 6,
      },
      {
        id: "push-5",
        name: "Lateral Raises",
        sets: 3,
        reps: "15-20",
        type: "push",
        dbId: 7,
      },
      {
        id: "push-6",
        name: "Overhead Triceps Extensions",
        sets: 3,
        reps: "8-12",
        type: "push",
        dbId: 8,
      },
      {
        id: "push-7",
        name: "Lateral Raises",
        sets: 3,
        reps: "15-20",
        type: "push",
        dbId: 7,
      },
    ],
    isDefault: true,
  },
  {
    id: "default-pull",
    name: "Pull",
    description: "Default pull workout focusing on back and biceps",
    workouts: [
      {
        id: "pull-1",
        name: "Deadlifts",
        sets: 5,
        reps: "5",
        amrap: true,
        type: "pull",
        dbId: 11,
      },
      {
        id: "pull-2",
        name: "Pulldowns (or Pullups/Chinups)",
        sets: 3,
        reps: "8-12",
        type: "pull",
        dbId: 12,
      },
      {
        id: "pull-3",
        name: "Chest Supported Rows",
        sets: 3,
        reps: "8-12",
        type: "pull",
        dbId: 13,
      },
      {
        id: "pull-4",
        name: "Face Pulls",
        sets: 5,
        reps: "15-20",
        type: "pull",
        dbId: 14,
      },
      {
        id: "pull-5",
        name: "Hammer Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
        dbId: 15,
      },
      {
        id: "pull-6",
        name: "Dumbbell Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
        dbId: 16,
      },
    ],
    isDefault: true,
  },
  {
    id: "default-pull-alt",
    name: "Pull Alt",
    description: "Alternate pull workout with different exercises",
    workouts: [
      {
        id: "pull-alt-1",
        name: "Barbell Rows",
        sets: 5,
        reps: "5",
        amrap: true,
        type: "pull",
        dbId: 10,
      },
      {
        id: "pull-alt-2",
        name: "Pulldowns (or Pullups/Chinups)",
        sets: 3,
        reps: "8-12",
        type: "pull",
        dbId: 12,
      },
      {
        id: "pull-alt-3",
        name: "Chest Supported Rows",
        sets: 3,
        reps: "8-12",
        type: "pull",
        dbId: 13,
      },
      {
        id: "pull-alt-4",
        name: "Face Pulls",
        sets: 3,
        reps: "15-20",
        type: "pull",
        dbId: 14,
      },
      {
        id: "pull-5",
        name: "Hammer Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
        dbId: 15,
      },
      {
        id: "pull-6",
        name: "Dumbbell Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
        dbId: 16,
      },
    ],
    isDefault: true,
  },
  {
    id: "default-legs",
    name: "Legs",
    description: "Default leg workout targeting all lower body muscles",
    workouts: [
      {
        id: "legs-1",
        name: "Squats",
        sets: 3,
        reps: "5",
        amrap: true,
        type: "legs",
        dbId: 17,
      },
      {
        id: "legs-2",
        name: "Romanian Deadlift",
        sets: 3,
        reps: "8-12",
        type: "legs",
        dbId: 18,
      },
      {
        id: "legs-3",
        name: "Leg Press",
        sets: 3,
        reps: "8-12",
        type: "legs",
        dbId: 19,
      },
      {
        id: "legs-4",
        name: "Leg Curls",
        sets: 3,
        reps: "8-12",
        type: "legs",
        dbId: 20,
      },
      {
        id: "legs-5",
        name: "Calf Raises",
        sets: 5,
        reps: "8-12",
        type: "legs",
        dbId: 21,
      },
    ],
    isDefault: true,
  },
];
