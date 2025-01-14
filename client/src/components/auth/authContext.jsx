/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  const signup = async (e, email, username, password, setSent, setErrors) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        // console.log( await response.json());
        setErrors(await response.json());
        return;
      }

      const { token } = await response.json();

      // Save the JWT to localStorage
      localStorage.setItem("authToken", token);
      setSent(true);
    } catch (error) {
      // console.error("Error Signing Up:", error);
      // alert("Sign Up failed. Please check your credentials.");
    }
  };

  const login = async (credentials) => {
    const { username, password } = credentials;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/validate-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response);

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      } else {
        logout();
      }
    } else {
      setUser(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
