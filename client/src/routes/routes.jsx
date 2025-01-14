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
import { About } from "../components/pages/about";
import { ForgotPassword } from "../components/pages/forgotPassword";
import { ResetPassword } from "../components/pages/resetPassword";

// import { ErrorPage } from "../components/pages/ErrorPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/exercises" element={<Exercises />} />

      {/* <Route path="*" element={<Home />} /> */}
    </>
  )
);
