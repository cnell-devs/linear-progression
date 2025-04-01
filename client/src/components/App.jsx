import { RouterProvider } from "react-router-dom";
import { router } from "../routes/routes";
import { AuthProvider } from "./auth/authContext";

console.log("Environment variables check:");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("Mode:", import.meta.env.MODE);

router;
const App = () => {
  return (
    <div className="container mx-auto w-4/5">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
