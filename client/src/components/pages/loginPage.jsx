import { useEffect, useState } from "react";
import { Nav } from "../nav";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
    /*
    try {
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

      const { token } = await response.json();

      // Save the JWT to localStorage
      localStorage.setItem("authToken", token);

      } catch (error) {
        console.error("Error logging in:", error);
        alert("Login failed. Please check your credentials.");
        } */
    navigate("/");
  };

  console.log(user);
  useEffect(() => {(user ? navigate("/") : null)}, [navigate, user]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <Nav />

        <form
          onSubmit={handleSubmit}
          //   className="mx-auto flex w-2/5 flex-1 flex-col content-center justify-center gap-2"
          className="absolute left-1/2 top-1/2 flex w-2/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
        >
          <h1 className="mb-5 text-center font-bold">Sign into your account</h1>

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="grow"
              placeholder="Username"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-blue-400"
            type="submit"
          >
            Submit
          </button>
          <div className="hover:-translate-y- mt-8 h-10 w-fit self-center text-center duration-200 hover:-translate-y-2 dark:hover:text-white">
            <Link to="/signup" className="">
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
