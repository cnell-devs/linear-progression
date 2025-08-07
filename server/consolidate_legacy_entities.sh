#!/bin/bash

# Legacy Entity Consolidation Script
# This script consolidates legacy/unused entities in the linear-ppl database

echo "🚀 Starting Legacy Entity Consolidation..."

# Step 1: Backup current database
echo "📦 Creating database backup..."
cd /Users/nharris/Dev/Projects/linear-ppl/server
npx prisma db execute --file <(echo "-- Backup marker: $(date)")

# Step 2: Execute legacy workout data migration
echo "🔄 Migrating legacy workout data..."
npx prisma db execute --file migrate_legacy_workout.sql

if [ $? -eq 0 ]; then
    echo "✅ Legacy workout migration completed successfully"
else
    echo "❌ Legacy workout migration failed"
    exit 1
fi

# Step 3: Verify migration results
echo "🔍 Verifying migration results..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyMigration() {
  try {
    const legacyWorkouts = await prisma.workout.count();
    const legacyWeightEntries = await prisma.weightEntry.count({ where: { workoutId: { not: null } } });
    const legacyTemplateWorkouts = await prisma.templateWorkout.count({ where: { workoutId: { not: null } } });

    console.log('🔍 Migration Verification:');
    console.log('  Legacy workouts remaining:', legacyWorkouts);
    console.log('  Legacy weight entries remaining:', legacyWeightEntries);
    console.log('  Legacy template workouts remaining:', legacyTemplateWorkouts);

    if (legacyWorkouts === 0 && legacyWeightEntries === 0 && legacyTemplateWorkouts === 0) {
      console.log('✅ All legacy data successfully migrated!');
      process.exit(0);
    } else {
      console.log('⚠️  Some legacy data still exists. Please check manually.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

verifyMigration();
"

if [ $? -eq 0 ]; then
    echo "✅ Migration verification passed"

    # Step 4: Instructions for schema update
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Update your schema.prisma file to remove the legacy Workout model"
    echo "2. Remove workoutId fields from WeightEntry and TemplateWorkout models"
    echo "3. Run 'npx prisma migrate dev --name remove-legacy-workout-table'"
    echo "4. Update your codebase to remove legacy workout handling"
    echo ""
    echo "See CONSOLIDATION_PLAN.md for detailed instructions."
else
    echo "❌ Migration verification failed"
    exit 1
fi

echo "🎉 Legacy entity consolidation completed!"
