import {  useState } from "react";
import { Nav } from "../nav";

import { useAuth } from "../auth/authContext";
import { useRecovery } from "../useRecovery";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const { user } = useAuth();
  const [sent, setSent] = useState();

  const { sendEmail } = useRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = sendEmail(email);
      console.log(result);
        setSent(result);

    } catch (err) {
      setLoginError(err.message);
    }
  };

  return (
    !user && (
      <>
        <div className="flex h-screen flex-col">
          <Nav />

          {!sent ? (
            <form
              onSubmit={handleSubmit}
              //   className="mx-auto flex w-2/5 flex-1 flex-col content-center justify-center gap-2"
              className="absolute left-1/2 top-1/2 flex w-2/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
            >
              <h1 className="mb-5 text-center font-bold">
                Enter your email address
              </h1>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-.5a.5.5 0 0 0-.496.438L8 8.293l6.496-4.355A.5.5 0 0 0 14 3.5H2Zm12 1.265-5.83 3.911a1.5 1.5 0 0 1-1.34 0L2 5.765V12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5.765Z" />
                </svg>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow"
                  placeholder="email"
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
            < div className="absolute left-1/2 top-1/2 text-center w-2/5 -translate-x-1/2 -translate-y-1/2 text-3xl" >Recovery email sent <br />Check your registered email</div>
          )}
        </div>
      </>
    )
  );
};
