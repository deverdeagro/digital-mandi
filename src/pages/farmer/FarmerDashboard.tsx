import { NavLink, Link } from "react-router-dom";
import LotTracker from "../../components/LotTracker";
import StatusChip from "../../components/StatusChip";
import { useLots } from "../../hooks/useLots";
import { formatPrice, formatWeight } from "../../utils/format";
import FarmerGreeting from "./components/FarmerGreeting";

export default function FarmerDashboard() {
  const { lots } = useLots();
  const openLots = lots.filter((lot) => lot.status === "Open for bids" || lot.status === "In transit").length;
  const bidCount = lots.reduce((total, lot) => total + lot.bids.length, 0);

  return (
    <section className="page-container farmer-page-container">
      <FarmerGreeting />
      <div className="dashboard-stats" aria-label="Season summary">
        <article><span>Lots</span><strong>4</strong><small>this season</small></article>
        <article><span>Open for bids</span><strong>{openLots}</strong><small>being seen</small></article>
        <article><span>Bids</span><strong>{bidCount}</strong><small>from buyers</small></article>
      </div>
      <nav aria-label="Farmer lots and bids" className="dashboard-tabs">
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} end to="/farmer">My lots</NavLink>
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} to="/farmer/bids?lot=lemon">Bids <strong>{bidCount}</strong></NavLink>
      </nav>
      <div className="lots-list">
        {lots.map((lot) => (
          <article className="lot-card farmer-lot-card" id={`lot-${lot.id}`} key={lot.id}>
            <div className="lot-heading">
              <span className="lot-leaf" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19.5 4.5C12 4.5 6 7.5 6 13.5c0 3 2.25 5.25 5.25 5.25S17.25 16.5 17.25 12c0-2.25-.75-4.5-2.25-6" />
                  <path d="M3.75 20.25c2.25-4.5 6-7.5 10.5-9.75" />
                </svg>
              </span>
              <h2>{lot.crop}</h2>
              <span className="grade-badge">Grade {lot.grade}</span>
              <button aria-label={`${lot.crop} lot options`} className="lot-menu" type="button">•••</button>
            </div>
            <p className="lot-meta"><span className="farmer-lot-id">{lot.id.toUpperCase()}</span><span>·</span>{formatWeight(lot.weightKg)}<span>·</span>{lot.origin}</p>
            <StatusChip
              label={lot.status === "Open for bids" ? "Graded and open for bids" : lot.status === "In transit" ? "On the way to hub" : lot.status === "Verified" ? "Verified and stored" : lot.status}
              status={lot.status}
            />
            <LotTracker stage={lot.stage} />
            <div className="farmer-lot-footer">
              <span className="farmer-destination">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Going to {lot.destination}
              </span>
              <Link className="farmer-bids-link" to={`/farmer/bids?lot=${lot.id}`}>
                {lot.bids.length} bids, top {formatPrice(Math.max(...lot.bids.map((bid) => bid.pricePerKg)))}
                <span aria-hidden="true">›</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
