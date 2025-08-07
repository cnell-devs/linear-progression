const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const globalWorkouts = [
  // Push workouts
  {
    name: "Bench Press",
    category: "push",
    muscleGroup: "chest",
    equipment: "barbell",
  },
  {
    name: "Incline Bench Press",
    category: "push",
    muscleGroup: "chest",
    equipment: "barbell",
  },
  {
    name: "Dumbbell Bench Press",
    category: "push",
    muscleGroup: "chest",
    equipment: "dumbbell",
  },
  {
    name: "Dumbbell Incline Press",
    category: "push",
    muscleGroup: "chest",
    equipment: "dumbbell",
  },
  {
    name: "Overhead Press",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "barbell",
  },
  {
    name: "Dumbbell Shoulder Press",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
  },
  {
    name: "Lateral Raises",
    category: "push",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
  },
  {
    name: "Tricep Dips",
    category: "push",
    muscleGroup: "triceps",
    equipment: "bodyweight",
  },
  {
    name: "Close Grip Bench Press",
    category: "push",
    muscleGroup: "triceps",
    equipment: "barbell",
  },
  {
    name: "Tricep Extensions",
    category: "push",
    muscleGroup: "triceps",
    equipment: "dumbbell",
  },

  // Pull workouts
  {
    name: "Deadlift",
    category: "pull",
    muscleGroup: "back",
    equipment: "barbell",
  },
  {
    name: "Pull Ups",
    category: "pull",
    muscleGroup: "back",
    equipment: "bodyweight",
  },
  {
    name: "Chin Ups",
    category: "pull",
    muscleGroup: "back",
    equipment: "bodyweight",
  },
  {
    name: "Barbell Rows",
    category: "pull",
    muscleGroup: "back",
    equipment: "barbell",
  },
  {
    name: "Dumbbell Rows",
    category: "pull",
    muscleGroup: "back",
    equipment: "dumbbell",
  },
  {
    name: "Lat Pulldowns",
    category: "pull",
    muscleGroup: "back",
    equipment: "machine",
  },
  {
    name: "Cable Rows",
    category: "pull",
    muscleGroup: "back",
    equipment: "machine",
  },
  {
    name: "Barbell Curls",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "barbell",
  },
  {
    name: "Dumbbell Curls",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "dumbbell",
  },
  {
    name: "Hammer Curls",
    category: "pull",
    muscleGroup: "biceps",
    equipment: "dumbbell",
  },

  // Leg workouts
  {
    name: "Squats",
    category: "legs",
    muscleGroup: "quads",
    equipment: "barbell",
  },
  {
    name: "Front Squats",
    category: "legs",
    muscleGroup: "quads",
    equipment: "barbell",
  },
  {
    name: "Bulgarian Split Squats",
    category: "legs",
    muscleGroup: "quads",
    equipment: "dumbbell",
  },
  {
    name: "Lunges",
    category: "legs",
    muscleGroup: "quads",
    equipment: "dumbbell",
  },
  {
    name: "Romanian Deadlifts",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "barbell",
  },
  {
    name: "Leg Curls",
    category: "legs",
    muscleGroup: "hamstrings",
    equipment: "machine",
  },
  {
    name: "Leg Press",
    category: "legs",
    muscleGroup: "quads",
    equipment: "machine",
  },
  {
    name: "Calf Raises",
    category: "legs",
    muscleGroup: "calves",
    equipment: "dumbbell",
  },
  {
    name: "Hip Thrusts",
    category: "legs",
    muscleGroup: "glutes",
    equipment: "barbell",
  },

  // Cardio
  {
    name: "Treadmill Running",
    category: "cardio",
    muscleGroup: "full body",
    equipment: "machine",
  },
  {
    name: "Elliptical",
    category: "cardio",
    muscleGroup: "full body",
    equipment: "machine",
  },
  {
    name: "Stationary Bike",
    category: "cardio",
    muscleGroup: "legs",
    equipment: "machine",
  },
  {
    name: "Rowing Machine",
    category: "cardio",
    muscleGroup: "full body",
    equipment: "machine",
  },
];

async function seedGlobalWorkouts() {
  console.log("Seeding global workouts...");

  for (const workout of globalWorkouts) {
    try {
      await prisma.globalWorkout.create({
        data: workout,
      });
      console.log(`Created: ${workout.name}`);
    } catch (error) {
      if (error.code === "P2002") {
        console.log(`Skipped: ${workout.name} (already exists)`);
      } else {
        console.error(`Error creating ${workout.name}:`, error);
      }
    }
  }

  console.log("Global workouts seeding completed!");
}

async function main() {
  await seedGlobalWorkouts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
