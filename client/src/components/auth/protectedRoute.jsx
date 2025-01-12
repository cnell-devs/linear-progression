/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext"; // Assuming AuthContext is already set up
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access authentication state
  useEffect(() => {

    if (!user) {
      return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }
  }, [user]);

  return children;
};
