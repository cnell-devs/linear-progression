const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Default template definitions
const defaultTemplates = [
  {
    name: "Push (Default)",
    description:
      "Default push workout focusing on chest, shoulders, and triceps",
    workouts: [
      {
        name: "Bench Press",
        sets: 3,
        reps: "8-12",
        type: "push",
      },
      {
        name: "Overhead Press",
        sets: 5,
        reps: "5",
        amrap: true,
        type: "push",
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-12",
        type: "push",
      },
      {
        name: "Tricep Pushdowns",
        sets: 3,
        reps: "8-12",
        type: "push",
      },
      {
        name: "Lateral Raises",
        sets: 3,
        reps: "15-20",
        type: "push",
      },
    ],
  },
  {
    name: "Pull (Default)",
    description: "Default pull workout focusing on back and biceps",
    workouts: [
      {
        name: "Deadlifts",
        sets: 5,
        reps: "5",
        amrap: true,
        type: "pull",
      },
      {
        name: "Pulldowns (or Pullups/Chinups)",
        sets: 3,
        reps: "8-12",
        type: "pull",
      },
      {
        name: "Chest Supported Rows",
        sets: 3,
        reps: "8-12",
        type: "pull",
      },
      {
        name: "Face Pulls",
        sets: 5,
        reps: "15-20",
        type: "pull",
      },
      {
        name: "Dumbbell Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
      },
    ],
  },
  {
    name: "Pull Alt (Default)",
    description: "Alternate pull workout with different exercises",
    workouts: [
      {
        name: "Barbell Rows",
        sets: 5,
        reps: "5",
        amrap: true,
        type: "pull",
      },
      {
        name: "Lat Pulldowns",
        sets: 3,
        reps: "8-12",
        type: "pull",
      },
      {
        name: "One-Arm Dumbbell Rows",
        sets: 3,
        reps: "8-12",
        type: "pull",
      },
      {
        name: "Rear Delt Flies",
        sets: 3,
        reps: "15-20",
        type: "pull",
      },
      {
        name: "Hammer Curls",
        sets: 4,
        reps: "8-12",
        type: "pull",
      },
    ],
  },
  {
    name: "Legs (Default)",
    description: "Default leg workout targeting all lower body muscles",
    workouts: [
      {
        name: "Squats",
        sets: 3,
        reps: "5",
        amrap: true,
        type: "legs",
      },
      {
        name: "Romanian Deadlift",
        sets: 3,
        reps: "8-12",
        type: "legs",
      },
      {
        name: "Leg Press",
        sets: 3,
        reps: "8-12",
        type: "legs",
      },
      {
        name: "Leg Curls",
        sets: 3,
        reps: "8-12",
        type: "legs",
      },
      {
        name: "Calf Raises",
        sets: 5,
        reps: "8-12",
        type: "legs",
      },
    ],
  },
];

/**
 * Creates default workout templates for a specific user
 * @param {string} userId - The user ID to create templates for
 */
async function createDefaultTemplatesForUser(userId) {
  try {
    // Create each default template for the user
    for (const templateData of defaultTemplates) {
      // First create workouts for this template
      const workoutIds = [];

      for (const workoutData of templateData.workouts) {
        const workout = await prisma.workout.create({
          data: {
            ...workoutData,
            userId,
            isGlobal: false, // These are user-specific
          },
        });
        workoutIds.push(workout.id);
      }

      // Now create the template with the workout IDs
      await prisma.workoutTemplate.create({
        data: {
          name: templateData.name,
          description: templateData.description,
          userId,
          workouts: {
            connect: workoutIds.map((id) => ({ id })),
          },
        },
      });
    }

    console.log(`Default templates created for user ${userId}`);
  } catch (error) {
    console.error("Error creating default templates:", error);
    throw error;
  }
}

module.exports = { createDefaultTemplatesForUser };
