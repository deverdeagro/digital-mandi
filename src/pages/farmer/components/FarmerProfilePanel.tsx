import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function FarmerProfilePanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2) ?? "DM";

  function closePanel() {
    setIsOpen(false);
    setShowDetails(false);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="farmer-profile">
      <button
        aria-controls="farmer-account-panel"
        aria-expanded={isOpen}
        aria-label={`${user?.name ?? "Farmer"} profile`}
        className="profile-button"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {initials}
      </button>
      {isOpen && (
        <section aria-labelledby="farmer-account-title" className="farmer-account-panel" id="farmer-account-panel">
          <div className="account-panel-header">
            <div>
              <h2 id="farmer-account-title">FARMER ACCOUNT</h2>
              <p className="account-name">{user?.name}</p>
              <p className="account-location">{user?.id} · Diphu, Karbi Anglong</p>
            </div>
            <button aria-label="Close farmer account" className="close-account-panel" onClick={closePanel} type="button">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 7 10 10M17 7 7 17" />
              </svg>
            </button>
          </div>
          {showDetails ? (
            <div className="farmer-details">
              <h3>Farmer details</h3>
              <dl>
                <div><dt>Name</dt><dd>{user?.name}</dd></div>
                <div><dt>Farm ID</dt><dd>{user?.id}</dd></div>
                <div><dt>Location</dt><dd>Diphu, Karbi Anglong</dd></div>
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
                    <strong>Farmer details</strong>
                    <small>Farm profile and contact</small>
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
