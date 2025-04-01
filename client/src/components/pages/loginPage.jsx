import { useEffect, useState } from "react";
import { Nav } from "../nav";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login, user } = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (!res) throw new Error();

      navigate("/");
    } catch (err) {
      setLoginError(err.message);
    }
  };

  useEffect(() => {
    user ? navigate("/") : null;
  }, [navigate, user]);

  if (user === undefined) {
    return (
      <div className="spinner-box">
        <span className="material-icons animate-spin spinner text-xl">
          refresh
        </span>
      </div>
    );
  }

  // If user is falsy (false, null), show the login form
  if (!user) {
    return (
      <>
        <div className="flex h-screen flex-col">
          <Nav />

          <form
            onSubmit={handleSubmit}
            className="absolute left-1/2 top-1/2 flex w-2/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
          >
            <h1 className="mb-5 text-center font-bold">
              Sign into your account
            </h1>
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
                type="password"
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
            <div className="text-center text-red-600">{loginError}</div>
            <div className="flex mt-8 justify-center gap-14">
              <div className="hover:-translate-y- h-10 w-fit self-center text-center duration-200 hover:-translate-y-2 dark:hover:text-white">
                <Link to="/signup" className="">
                  Create an Account
                </Link>
              </div>
              <div className="hover:-translate-y- h-10 w-fit self-center text-center duration-200 hover:-translate-y-2 dark:hover:text-white">
                <Link to="/forgot-password" className="">
                  Forgot My Password
                </Link>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  // If user is truthy, they will be redirected by the useEffect
  return null;
};
