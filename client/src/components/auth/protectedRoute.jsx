/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext"; // Assuming AuthContext is already set up

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access authentication state

  setTimeout(() => {

    if (!user) {
      return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }
  }, 1000);

  return children;
};


