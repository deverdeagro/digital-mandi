import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";

export default function BuyerLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="role-app buyer-app">
      <header className="role-header buyer-header">
        <Logo />
        <div className="role-account">
          <span aria-label={user?.name ?? "Buyer"} className="buyer-profile-avatar">
            {user?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "BY"}
          </span>
          <button className="text-button" onClick={logout} type="button">Log out</button>
        </div>
      </header>
      <main className="role-main buyer-main"><Outlet /></main>
    </div>
  );
}
