import { useEffect, useState } from "react";
import { Nav } from "../nav";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { useRecovery } from "../useRecovery";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [changed, setChanged] = useState()
  const [loginError, setLoginError] = useState("");
  const { user } = useAuth();
  //   let navigate = useNavigate();
  const { resetPassword } = useRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = resetPassword(password);
      console.log(result);
        setChanged(result);

    } catch (err) {
      setLoginError(err.message);
    }
  };
  /*
  useEffect(() => {
    user ? navigate("/") : null;
  }, [navigate, user]);

  console.log(user);

  if (user === undefined)
    return (
      <div className="spinner-box">
        <span className="material-icons animate-spin spinner text-xl">
          refresh
        </span>
      </div>
    ); */


  return (
    !user && (
      <>
        <div className="flex h-screen flex-col">
          <Nav />

          {!changed ? (
            <form
              onSubmit={handleSubmit}
              //   className="mx-auto flex w-2/5 flex-1 flex-col content-center justify-center gap-2"
              className="absolute left-1/2 top-1/2 flex w-2/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
            >
              <h1 className="mb-5 text-center font-bold">
                Enter your new password
              </h1>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" />
                </svg>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow"
                  placeholder="password"
                />
              </label>
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-blue-400"
                type="submit"
              >
                Submit
              </button>
              <div className="text-center text-red-600">{loginError}</div>
            </form>
          ) : (
            <div className="absolute left-1/2 top-1/2 text-center w-2/5 -translate-x-1/2 -translate-y-1/2 text-3xl">
              Password Changed!
            </div>
          )}
        </div>
      </>
    )
  );
};
