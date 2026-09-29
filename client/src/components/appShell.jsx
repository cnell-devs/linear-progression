import { Outlet } from "react-router-dom";
import { BottomNav } from "./bottomNav";

// Wraps every route so the tab bar persists across navigation. The bottom
// padding reserves space for it (plus the iOS home indicator) so page content
// is never hidden behind the bar. The top inset matters now that there's no
// title bar to hold content clear of the status bar.
export const AppShell = () => (
  <>
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <Outlet />
    </div>
    <BottomNav />
  </>
);
