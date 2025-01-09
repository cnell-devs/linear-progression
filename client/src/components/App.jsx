import { RouterProvider } from "react-router-dom";
import { router } from "../routes/routes";
import { AuthProvider } from "./auth/authContext";

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
