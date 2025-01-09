/* eslint-disable react/prop-types */

import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./auth/authContext";
export const Nav = ({ workouts, split, setSplit }) => {
  const [searchParams] = useSearchParams();
  const back = searchParams.get("split");
  const { user } = useAuth()

  const type = workouts
    ? workouts[0].type.charAt(0).toUpperCase() + workouts[0].type.slice(1)
    : "Linear Progression";

  return (
    <>
      <div className="navbar mt-4 px-0 py-0">
        <div className="flex-1 flex">
          {(back || split) && (
            <>
              {!split ? (
                <Link to={`/`}>
                  <button className="material-icons">arrow_back_ios</button>
                </Link>
              ) : (
                  <button onClick={() => setSplit(null)} className="material-icons">arrow_back_ios</button>

              )}
              <div className="divider divider-horizontal"></div>
            </>
          )}

          <Link
            to={"/"}
            className="text-3xl"
          >
            {type}
          </Link>
        </div>

        {
          /* localStorage.getItem("authToken") &&  */ <div className="dropdown dropdown-end flex-none">
            <div
              role="button"
              className="btn material-icons shadow-none border-none bg-transparent text-2xl"
              tabIndex="0"
            >
              menu
            </div>
            <ul
              tabIndex="0"
              className="menu dropdown-content z-[1] w-52 rounded-lg border bg-base-100 p-2 shadow"
            >
            { user &&  <li>
                <Link to="/profile">My Profile</Link>
              </li>}
              <li>
                <Link to="/">Workouts</Link>
              </li>
              <li>
                {user ? (
                  <Link to="/logout">Log Out</Link>
                ) : (
                  <Link to="/login">Log In</Link>
                )}
              </li>
            </ul>
          </div>
        }
      </div>
    </>
  );
};

// Nav.propTypes = {

// };
