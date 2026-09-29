import { NavLink } from "react-router-dom";
import { useAuth } from "./auth/authContext";

const TABS = [
  { to: "/", icon: "home", label: "Home", end: true },
  { to: "/workout", icon: "fitness_center", label: "Workout" },
  { to: "/history", icon: "history", label: "History" },
  { to: "/progress", icon: "insights", label: "Progress" },
  { to: "/profile", icon: "person", label: "Profile" },
];

// Persistent tab bar. A workout app is used one-handed mid-set, so the primary
// destinations live in thumb reach rather than behind the top-right menu.
export const BottomNav = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav className="btm-nav fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-base-300 bg-base-100 pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            isActive
              ? "active border-t-2 border-primary text-primary"
              : "text-base-content/60"
          }
        >
          <span className="material-icons text-2xl">{tab.icon}</span>
          <span className="btm-nav-label text-[0.65rem]">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
