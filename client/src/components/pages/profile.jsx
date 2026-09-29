/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { Nav } from "../nav";

const Field = ({ label, value }) => (
  <div>
    <div className="text-xs font-medium uppercase tracking-wide opacity-50">
      {label}
    </div>
    <div className="text-lg">{value}</div>
  </div>
);

// Account details and the links that used to live in the header menu.
// Training stats live on Progress; the exercise library lives with Templates.
export const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4 p-4 sm:p-6">
            <h2 className="font-bold">Account</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Username" value={user?.username} />
              <Field label="Email" value={user?.email || "Not set"} />
              <Field
                label="Account Type"
                value={user?.admin ? "Administrator" : "Standard User"}
              />
              <Field
                label="Verified"
                value={
                  user?.verified ? (
                    <span className="badge badge-success badge-sm">Yes</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">No</span>
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <Link to="/" className="btn btn-outline justify-start">
                <span className="material-icons mr-1">list_alt</span>
                Templates &amp; Exercises
              </Link>
              <Link to="/logout" className="btn btn-ghost justify-start">
                <span className="material-icons mr-1">logout</span>
                Log Out
              </Link>
            </div>
          </div>
        </div>

        {/* /about holds account deletion and is otherwise unlinked. */}
        <div className="mt-6 text-center">
          <Link to="/about" className="btn btn-ghost btn-sm text-error">
            Delete Account
          </Link>
        </div>
      </div>
    </>
  );
};
