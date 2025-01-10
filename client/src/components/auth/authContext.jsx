/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);


  const login = async (credentials) => {
    const { username, password } = credentials;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const { token, user } = await response.json();

    // Save the JWT to localStorage
    if (token) {
      localStorage.setItem("authToken", token);
      setUser(user);
    }
  };

  const logout = () => {

    localStorage.removeItem("authToken");
    setUser(null);
  };

  const checkAuth = async () => {

    const token = localStorage.getItem("authToken");
    if (token) {
      // Validate token by sending it to the backend

      const response = await fetch("/api/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // console.log(response);
        const { user } = await response.json();


        setUser(user);
      } else {

        logout();
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
