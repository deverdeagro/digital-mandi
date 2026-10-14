import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";
import { roleHome } from "../../routes/roleHome";
import type { Role } from "../../types";

const roleOptions: { value: Role; label: string; detail: string }[] = [
  { value: "farmer", label: "Farmer", detail: "Manage your lots and bids" },
  { value: "spoke", label: "Spoke staff", detail: "Receive and grade produce" },
  { value: "hub", label: "Hub staff", detail: "Coordinate lots at the hub" },
  { value: "buyer", label: "Buyer", detail: "Browse lots and place bids" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("farmer");
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId.trim()) {
      setError("Enter your account ID to continue.");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError("Enter your 4-digit PIN.");
      return;
    }

    login(role, userId.trim());
    navigate(roleHome[role], { replace: true });
  }

  return (
    <main className="welcome-page">
      <section aria-labelledby="welcome-title" className="welcome-card role-login-card">
        <Logo />
        <p className="welcome-eyebrow">ONE MARKETPLACE, EVERY ROLE</p>
        <h1 id="welcome-title">Welcome</h1>
        <p className="welcome-subtitle">Sign in to Digital Mandi and continue your work.</p>

        <fieldset className="role-picker">
          <legend className="field-label">I am signing in as</legend>
          <div className="role-options">
            {roleOptions.map((option) => (
              <button
                aria-pressed={role === option.value}
                className={`role-option${role === option.value ? " selected" : ""}`}
                key={option.value}
                onClick={() => {
                  setRole(option.value);
                  setError("");
                }}
                type="button"
              >
                <strong>{option.label}</strong>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <form className="welcome-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="account-id">Account ID</label>
          <input
            autoComplete="username"
            id="account-id"
            onChange={(event) => {
              setUserId(event.target.value);
              setError("");
            }}
            placeholder="e.g. ERDE-2048"
            value={userId}
          />
          <label className="field-label pin-label" htmlFor="login-pin">4-digit PIN</label>
          <input
            autoComplete="current-password"
            id="login-pin"
            inputMode="numeric"
            onChange={(event) => {
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
              setError("");
            }}
            placeholder="1234"
            type="password"
            value={pin}
          />
          <p className="form-hint">Demo sign-in: enter any account ID and a 4-digit PIN.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="submit-button" type="submit">Continue to {roleOptions.find((item) => item.value === role)?.label}</button>
        </form>
      </section>
    </main>
  );
}
