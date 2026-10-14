import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";

export default function FarmerLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="role-app farmer-app">
      <header className="role-header farmer-role-header">
        <Logo />
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        {menuOpen && (
          <nav aria-label="Farmer menu" className="farmer-menu">
            <Link onClick={() => setMenuOpen(false)} to="/farmer">My lots</Link>
            <Link onClick={() => setMenuOpen(false)} to="/farmer/bids?lot=lemon">My bids</Link>
            <button onClick={logout} type="button">Log out</button>
          </nav>
        )}
        <div className="visually-hidden">
          Signed in as {user?.name}
        </div>
      </header>
      <main className="role-main farmer-main">
        <Outlet />
      </main>
    </div>
  );
}
