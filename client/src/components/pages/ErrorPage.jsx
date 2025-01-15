import { Link, useRouteError } from "react-router-dom";
import { Nav } from "../nav";

export const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <Nav />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1>Oops, an error occurred</h1>
        <p>{error?.message}</p>
        <Link to="/" className="text-blue-500">
          <u>Head back home</u>
        </Link>
      </div>
    </>
  );
};
