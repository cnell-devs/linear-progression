import { Nav } from "../nav";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">
            Linear PPL Workout Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your push, pull, and leg workouts with our improved hybrid
            system
          </p>

          {user ? (
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Main Workout Section */}
              <div className="card bg-primary text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">🏋️ Workouts (V2)</h2>
                  <p>
                    Manage your workouts with our new hybrid system featuring:
                    <br />• Smart autocomplete from global exercise database
                    <br />• Custom workout creation
                    <br />• Better categorization and organization
                  </p>
                  <div className="card-actions justify-end">
                    <Link to="/exercises" className="btn btn-secondary">
                      Start a Workout
                    </Link>
                  </div>
                </div>
              </div>

              {/* Templates Section */}
              <div className="card bg-secondary text-secondary-content">
                <div className="card-body">
                  <h2 className="card-title">📋 Templates</h2>
                  <p>
                    Create and manage workout templates for structured routines.
                    Perfect for following established programs like PPL.
                  </p>
                  <div className="card-actions justify-end">
                    <Link to="/templates" className="btn btn-primary">
                      Manage Templates
                    </Link>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="card bg-accent text-accent-content">
                <div className="card-body">
                  <h2 className="card-title">📊 Progress</h2>
                  <p>
                    View your workout history and track your strength
                    progression over time with detailed charts and analytics.
                  </p>
                  <div className="card-actions justify-end">
                    <Link to="/exercises" className="btn btn-neutral">
                      View Progress
                    </Link>
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="card bg-neutral text-neutral-content">
                <div className="card-body">
                  <h2 className="card-title">⚙️ Profile</h2>
                  <p>
                    Manage your account settings, view your workout statistics,
                    and customize your experience.
                  </p>
                  <div className="card-actions justify-end">
                    <Link to="/profile" className="btn btn-ghost">
                      Go to Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-6">
                Sign up to start tracking your workouts and see your progress
                over time.
              </p>
              <div className="space-x-4">
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
              </div>
            </div>
          )}

          {/* What's New Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-4 text-xl">
              ✨ What's New in V2?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-blue-700 text-left">
              <ul className="space-y-2">
                <li>
                  • <strong>Smart Autocomplete:</strong> Search from thousands
                  of pre-built exercises
                </li>
                <li>
                  • <strong>Global Database:</strong> Workouts shared and
                  improved by the community
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  • <strong>Custom Workouts:</strong> Create your own exercises
                  that can be suggested to others
                </li>
                <li>
                  • <strong>Better Organization:</strong> Workouts categorized
                  by muscle group and equipment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
