import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function StaffAccountPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2) ?? "DM";
  const roleLabel = user?.role === "hub" ? "Hub staff" : "Spoke staff";
  const location = user?.role === "hub" ? "Karbiang Hub" : "Diphu Spoke";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="staff-profile">
      <button
        aria-controls="staff-account-panel"
        aria-expanded={isOpen}
        aria-label={`${user?.name ?? roleLabel} profile`}
        className="profile-button"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {initials}
      </button>
      {isOpen && (
        <section aria-labelledby="staff-account-title" className="staff-account-panel" id="staff-account-panel">
          <div className="account-panel-header">
            <div>
              <h2 id="staff-account-title">{roleLabel.toUpperCase()} ACCOUNT</h2>
              <p className="account-name">{user?.name}</p>
              <p className="account-location">{user?.id} · {location}</p>
            </div>
            <button
              aria-label="Close account"
              className="close-account-panel"
              onClick={() => {
                setIsOpen(false);
                setShowDetails(false);
              }}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 7 10 10M17 7 7 17" />
              </svg>
            </button>
          </div>
          {showDetails ? (
            <div className="staff-details">
              <h3>My details</h3>
              <dl>
                <div><dt>Name</dt><dd>{user?.name}</dd></div>
                <div><dt>Staff ID</dt><dd>{user?.id}</dd></div>
                <div><dt>Role</dt><dd>{roleLabel}</dd></div>
                <div><dt>Location</dt><dd>{location}</dd></div>
              </dl>
              <button className="farmer-details-back" onClick={() => setShowDetails(false)} type="button">Back to account</button>
            </div>
          ) : (
            <ul className="account-options">
              <li>
                <button className="account-option-button" onClick={() => setShowDetails(true)} type="button">
                  <span className="account-option-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 20c.5-3.3 3.1-5.5 7-5.5s6.5 2.2 7 5.5" />
                    </svg>
                  </span>
                  <span className="account-option-copy">
                    <strong>My details</strong>
                    <small>Staff profile and location</small>
                  </span>
                  <span className="account-option-arrow" aria-hidden="true">›</span>
                </button>
              </li>
              <li>
                <button className="account-option-button" onClick={handleLogout} type="button">
                  <span className="account-option-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M10 17l5-5-5-5M15 12H3" />
                      <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                    </svg>
                  </span>
                  <span className="account-option-copy">
                    <strong>Log out</strong>
                    <small>Sign out of your account</small>
                  </span>
                  <span className="account-option-arrow" aria-hidden="true">›</span>
                </button>
              </li>
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
