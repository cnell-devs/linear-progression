import { Link } from "react-router-dom";
import { Nav } from "../nav";
import { useAuth } from "../auth/authContext";
import { useTemplates } from "../../hooks/useTemplates";

export function Home() {
  const { user } = useAuth();
  const { userTemplates, loading } = useTemplates();

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <>
        <Nav />
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-5xl font-bold mb-6">Linear Progression</h1>
            <p className="text-xl text-gray-600 mb-8">
              Track your workouts, build templates, and achieve your fitness
              goals with our simple and powerful workout tracking app.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show templates overview for authenticated users
  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
            <p className="text-xl text-gray-600">
              Ready to continue your fitness journey?
            </p>
          </div>

          {/* User Templates */}
          <div className="bg-base-200 rounded-box p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Templates</h2>
              <Link to="/templates" className="btn btn-ghost btn-sm">
                Manage Templates
                <span className="material-icons ml-1">arrow_forward</span>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="material-icons animate-spin spinner text-4xl">
                  refresh
                </span>
              </div>
            ) : userTemplates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {template.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {template.templateWorkouts?.length || 0} workout
                        {(template.templateWorkouts?.length || 0) !== 1
                          ? "s"
                          : ""}
                      </p>
                      <div className="card-actions justify-end mt-2">
                        <Link
                          to={`/exercises?template=${template.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Use Template
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven&apos;t created any workout templates yet.
                </p>
                <Link to="/templates" className="btn btn-primary">
                  Create Your First Template
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
