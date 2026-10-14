import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";
import StaffAccountPanel from "./StaffAccountPanel";
import { useLots } from "../hooks/useLots";

export default function StaffLayout() {
  const { user } = useAuth();
  const { lots } = useLots();
  const isHub = user?.role === "hub";
  const basePath = isHub ? "/hub" : "/spoke";
  const nextLotToGrade = lots.find((lot) => lot.status === "At spoke" || lot.grade === "Pending") ?? lots[0];

  return (
    <div className="role-app staff-app">
      <aside className="staff-sidebar">
        <Logo />
        <p className="sidebar-label">{isHub ? "HUB OPERATIONS" : "SPOKE OPERATIONS"}</p>
        <nav aria-label={`${isHub ? "Hub" : "Spoke"} navigation`}>
          <NavLink end to={basePath}>{isHub ? "Hub overview" : "Incoming lots"}</NavLink>
          {isHub ? (
            <NavLink to="/hub/bid-activity">Hub bid activity</NavLink>
          ) : (
            <>
              <NavLink to={nextLotToGrade ? `/spoke/lots/${nextLotToGrade.id}/grade` : "/spoke"}>Grade a lot</NavLink>
              <NavLink to="/spoke/bid-activity">Spoke bid activity</NavLink>
            </>
          )}
        </nav>
      </aside>
      <main className="role-main staff-main">
        <header className="staff-topbar">
          <span>{isHub ? "Hub operations" : "Spoke operations"}</span>
          <StaffAccountPanel />
        </header>
        <Outlet />
      </main>
    </div>
  );
}
