const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

let databaseUrl;

if (process.env.NODE_ENV === "production") {
  databaseUrl = process.env.DATABASE_URL_PROD;
} else {
  // Default to development if NODE_ENV is not set
  databaseUrl = process.env.DATABASE_URL_DEV;
}
process.env.DATABASE_URL = databaseUrl;


const userID = "f8c425fb-9813-4e0d-96cc-e6a0ba4c4116"; // Replace with the target user ID

async function seedWeightEntries() {
  const startDate = new Date(); // Today's date
  startDate.setMonth(startDate.getMonth() - 6); // Go back 6 months

  const endDate = new Date(); // End date is today

  const workouts = await prisma.workout.findMany(); // Fetch all workouts from DB

  if (workouts.length === 0) {
    console.error("No workouts found. Ensure you have seeded workouts.");
    return;
  }

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // 50% chance to create an entry for this day
    if (Math.random() > 0.5) {
      const randomWorkout =
        workouts[Math.floor(Math.random() * workouts.length)]; // Random workout
      const randomWeight = Math.floor(Math.random() * 19 + 2) * 5; // Random weight multiple of 5 (10–100)

      await prisma.weightEntry.create({
        data: {
          userId: userID,
          workoutId: randomWorkout.id,
          weight: randomWeight,
          date: new Date(currentDate), // Use the current day
        },
      });

      console.log(
        `Created weight entry for ${
          currentDate.toISOString().split("T")[0]
        }: Workout ID ${randomWorkout.id}, Weight ${randomWeight}`
      );
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(
    "Sample weight entries created for 6 months with one entry per day!"
  );
  await prisma.$disconnect();
}

seedWeightEntries().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
