import { RouterProvider } from "react-router-dom";
import { router } from "../routes/routes";
import { AuthProvider } from "./auth/authContext";

console.log("Environment variables check:");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("Mode:", import.meta.env.MODE);

router;
const App = () => {
  return (
    <div className="container mx-auto w-full px-4 sm:w-5/6 lg:w-4/5 sm:px-6">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
