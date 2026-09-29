import { Link } from "react-router-dom";
import { Nav } from "../nav";
import { useAuth } from "../auth/authContext";
import { TemplatesAndExercises } from "../templates/TemplatesAndExercises";

export function Home() {
  const { user } = useAuth();

  // Landing page for signed-out visitors.
  if (!user) {
    return (
      <>
        <Nav />
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center">
            <h1 className="mb-6 text-5xl font-bold">Linear Progression</h1>
            <p className="mb-8 text-xl text-gray-600">
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

  // Signed in: templates and the exercise library are the landing content,
  // since starting a workout is the reason to open the app.
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <div className="mb-6 text-center">
          {/* Same plain-text treatment as the old title bar, scaled down.
              The full name is kept for screen readers so they don't announce
              the mark letter by letter. */}
          <div className="mb-4 text-lg">
            <span aria-hidden="true">LP</span>
            <span className="sr-only">Linear Progression</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Welcome back!</h1>
          <p className="text-base text-gray-600 sm:text-xl">
            Ready to continue your fitness journey?
          </p>
        </div>

        <div className="rounded-box bg-base-200 p-4 sm:p-6">
          <TemplatesAndExercises />
        </div>
      </div>
    </>
  );
}
