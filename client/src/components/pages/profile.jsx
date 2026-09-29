/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { Nav } from "../nav";
import { api } from "../../utils/api";

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
  const { user, updateUser } = useAuth();
  const [savingUnit, setSavingUnit] = useState(false);
  const unit = user?.weightUnit === "KG" ? "KG" : "LB";

  // Weights are stored in pounds; this only changes how they are shown and
  // entered, so switching back and forth is lossless.
  const setUnit = async (next) => {
    if (next === unit || savingUnit) return;
    setSavingUnit(true);
    try {
      const updated = await api("/me/preferences", {
        method: "PATCH",
        body: { weightUnit: next },
      });
      updateUser({ weightUnit: updated.weightUnit });
    } catch (error) {
      console.error("Could not change units:", error);
      alert("Could not change units: " + error.message);
    } finally {
      setSavingUnit(false);
    }
  };

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

            <div className="border-t pt-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide opacity-50">
                Weight Units
              </div>
              <div role="tablist" className="tabs tabs-boxed w-fit">
                {["LB", "KG"].map((option) => (
                  <button
                    key={option}
                    role="tab"
                    className={`tab ${unit === option ? "tab-active" : ""}`}
                    onClick={() => setUnit(option)}
                    disabled={savingUnit}
                  >
                    {option === "LB" ? "lbs" : "kg"}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs opacity-60">
                Existing workouts are converted for display — nothing is
                rewritten.
              </p>
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
