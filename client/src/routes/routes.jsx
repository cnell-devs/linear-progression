import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import { Home } from "../components/pages/home";
import { SignUp } from "../components/pages/signUp";
import { Login } from "../components/pages/loginPage";
import { Logout } from "../components/pages/logOut";
import { Profile } from "../components/pages/profile";
import { ProtectedRoute } from "../components/auth/protectedRoute";
import { About } from "../components/pages/about";
import { ForgotPassword } from "../components/pages/forgotPassword";
import { ResetPassword } from "../components/pages/resetPassword";
import { ErrorPage } from "../components/pages/ErrorPage";
import { ActiveSession } from "../components/pages/activeSession";
import { History } from "../components/pages/history";
import { Progress } from "../components/pages/progress";
import { AppShell } from "../components/appShell";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppShell />}>
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
      {/* Templates and exercises now live on the home page; keep the old
          path working for bookmarks and existing links. */}
      <Route path="/templates" element={<Navigate to="/" replace />} />
      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <ActiveSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);
