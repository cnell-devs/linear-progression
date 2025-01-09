import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Home } from "../components/pages/home";
import { SignUp } from "../components/pages/signUp";
import { Login } from "../components/pages/loginPage";
import { Logout } from "../components/pages/logOut";
import { Exercises } from "../components/pages/exercises";
import { Profile } from "../components/pages/profile";
import { ProtectedRoute } from "../components/auth/protectedRoute";

// import { ErrorPage } from "../components/pages/ErrorPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute>
            <Exercises />
          </ProtectedRoute>
        }
      />

      {/* <Route path="*" element={<Home />} /> */}
    </>
  )
);
