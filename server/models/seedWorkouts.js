const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();

const addWorkouts = async () => {
  const workoutsData = [
    {
      name: "Bench Press",
      sets: 3,
      reps: "8-12",
      amrap: false,
      type: "push",
      weights: undefined,
    },
    {
      name: "Overhead Press",
      sets: 5,
      reps: "5",
      amrap: true,
      type: "push",
      weights: undefined,
    },
    {
      name: "Incline Dumbbell Press",
      sets: 3,
      reps: "8-12",
      type: "push",
      weights: undefined,
    },
    {
      name: "Tricep Pushdowns",
      sets: 3,
      reps: "8-12",
      type: "push",
      weights: undefined,
      superset: {
        create: {
          name: "Lateral Raises",
          sets: 3,
          reps: "15-20",
          type: "push",
          weights: undefined,
        },
      },
    },
    {
      name: "Overhead Triceps Extensions",
      sets: 3,
      reps: "8-12",
      type: "push",
      weights: undefined,
      superset: {
        create: {
          name: "Lateral Raises",
          sets: 3,
          reps: "15-20",
          type: "push",
          weights: undefined,
        },
      },
    },
    // pull
    {
      name: "Deadlifts",
      sets: 5,
      reps: "5",
      amrap: true,
      type: "pull",
      weights: undefined,
      alternate: {
        create: {
          name: "Barbell Rows",
          sets: 5,
          reps: "5",
          type: "pull",
          amrap: true,
          weights: undefined,
        },
      },
    },
    {
      name: "Pulldowns (or Pullups/Chinups)",
      sets: 3,
      reps: "8-12",
      type: "pull",
      weights: undefined,
    },
    {
      name: "Chest Supported Rows",
      sets: 3,
      reps: "8-12",
      type: "pull",
      weights: undefined,
    },
    {
      name: "Face Pulls",
      sets: 5,
      reps: "15-20",
      type: "pull",
      weights: undefined,
    },
    {
      name: "Hammer Curls",
      sets: 4,
      reps: "8-12",
      type: "pull",
      weights: undefined,
    },
    {
      name: "Dumbbell Curls",
      sets: 4,
      reps: "8-12",
      type: "pull",
      weights: undefined,
    },
    // legs
    {
      name: "Squats",
      sets: 3,
      reps: "5",
      amrap: true,
      type: "legs",
      weights: undefined,
    },
    {
      name: "Romanian Deadlift",
      sets: 3,
      reps: "8-12",
      type: "legs",
      weights: undefined,
    },
    {
      name: "Leg Press",
      sets: 3,
      reps: "8-12",
      type: "legs",
      weights: undefined,
    },
    {
      name: "Leg Curls",
      sets: 3,
      reps: "8-12",
      type: "legs",
      weights: undefined,
    },
    {
      name: "Calf Raises",
      sets: 5,
      reps: "8-12",
      type: "legs",
      weights: undefined,
    },
  ];

  // Loop through each workout and create them using prisma.workout.create
  for (const workout of workoutsData) {
    await prisma.workout.create({
      data: workout,
    });
  }

  console.log("All workouts added successfully.");
};

// addWorkouts()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
