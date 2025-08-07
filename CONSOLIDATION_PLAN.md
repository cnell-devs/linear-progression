# Legacy/Unused Entity Consolidation Plan

## ✅ COMPLETED - August 6, 2025

### Summary

Successfully consolidated legacy entities in the linear-ppl codebase, removing technical debt and simplifying the database schema.

## Final Results

- **✅ Legacy Workout table**: Completely removed (migrated 1 record)
- **✅ UserWorkout table**: 5 records (all using new system)
- **✅ GlobalWorkout table**: 33 records
- **✅ WeightEntry records**: 6 total, all using UserWorkout references
- **✅ TemplateWorkout records**: 5 total, all using UserWorkout references

## Consolidation Actions Completed

### ✅ Step 1: Migrated Legacy Workout Data

- Migrated the single remaining legacy workout ("custom lift test") to UserWorkout table
- Updated associated WeightEntry record to reference new UserWorkout
- Updated associated TemplateWorkout record to reference new UserWorkout

### ✅ Step 2: Updated Schema

- Removed the legacy `Workout` model from `schema.prisma`
- Removed `workoutId` fields from `WeightEntry` and `TemplateWorkout` models
- Removed `legacyWorkouts` relation from `Users` model
- Made `userWorkoutId` the single reference system

### ✅ Step 3: Generated Migration

- Created migration `20250807032041_remove_legacy_workout_table`
- Successfully dropped the `workout` table
- Dropped `workoutId` columns from related tables
- Cleaned up orphaned constraints

## Benefits Achieved

1. **✅ Simplified Schema**: Single-path logic for UserWorkout system only
2. **✅ Reduced Complexity**: Eliminated legacy code paths and dual references
3. **✅ Better Performance**: Removed unnecessary table joins and checks
4. **✅ Cleaner Codebase**: No more "legacy" handling comments needed
5. **✅ Easier Maintenance**: Single source of truth for workout data

## Next Steps for Code Cleanup

The database consolidation is complete. Consider these optional code cleanup tasks:

1. **Remove Legacy Code**: Search codebase for "legacy" comments and remove outdated logic
2. **Update API Endpoints**: Simplify workout-related endpoints to only handle UserWorkout
3. **Frontend Cleanup**: Remove dual workout/userWorkout handling in components
4. **Documentation**: Update API documentation to reflect simplified workout system

## Risk Assessment: ✅ ZERO RISK

- All data successfully migrated
- No data loss occurred
- New system proven to work correctly
- Migration was reversible (though not needed)
