-- CreateTable
CREATE TABLE "workout_session" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" INTEGER,
    "name" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_set" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "userWorkoutId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "rpe" INTEGER,
    "isWarmup" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workout_session_userId_date_idx" ON "workout_session"("userId", "date");

-- CreateIndex
CREATE INDEX "workout_set_sessionId_userWorkoutId_idx" ON "workout_set"("sessionId", "userWorkoutId");

-- CreateIndex
CREATE INDEX "workout_set_userWorkoutId_idx" ON "workout_set"("userWorkoutId");

-- AddForeignKey
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set" ADD CONSTRAINT "workout_set_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workout_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_set" ADD CONSTRAINT "workout_set_userWorkoutId_fkey" FOREIGN KEY ("userWorkoutId") REFERENCES "user_workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
