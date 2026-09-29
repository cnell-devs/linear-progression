import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/authContext";

// Auth pages are dead ends without the bottom tab bar, so they keep a way back.
const BACK_PATHS = ["/forgot-password", "/signup", "/login"];

// There's no title bar any more — each page owns its own heading and the tab
// bar handles navigation. This renders only when it has an actual control to
// show, and nothing at all otherwise, so no empty strip eats vertical space.
export const Nav = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const showBack = BACK_PATHS.includes(pathname);
  const showLogIn = !user && pathname !== "/login";

  if (!showBack && !showLogIn) return null;

  return (
    <div className="navbar min-h-0 px-2 py-2 sm:px-0">
      <div className="flex flex-1 items-center">
        {showBack && (
          <Link to="/" aria-label="Back to home">
            <button className="material-icons p-1 sm:p-0">
              arrow_back_ios
            </button>
          </Link>
        )}
      </div>

      {showLogIn && (
        <Link to="/login" className="btn btn-sm btn-ghost flex-none">
          Log In
        </Link>
      )}
    </div>
  );
};
