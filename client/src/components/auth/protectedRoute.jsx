/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext"; // Assuming AuthContext is already set up

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access authentication state

  if (user === undefined) {
    return (
      <div className="spinner-box">
        <span className="material-icons animate-spin spinner text-6xl">
          refresh
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children;
};
