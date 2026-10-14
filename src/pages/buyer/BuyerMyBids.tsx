import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLots } from "../../hooks/useLots";
import { formatPrice, formatWeight } from "../../utils/format";

export default function BuyerMyBids() {
  const { user } = useAuth();
  const { lots } = useLots();
  const bids = lots.flatMap((lot) => lot.bids
    .filter((bid) => bid.buyer === user?.name)
    .map((bid) => ({ ...bid, lot })))
    .sort((left, right) => right.id.localeCompare(left.id));

  return (
    <section className="page-container buyer-page-container buyer-my-bids-page">
      <header className="buyer-greeting buyer-bids-heading">
        <p className="eyebrow">BUYER WORKSPACE</p>
        <h1>Your recent<br /><span>bids.</span></h1>
        <p>Track the offers you have placed on open lots.</p>
      </header>
      <nav aria-label="Browse lots and bids" className="dashboard-tabs buyer-tabs">
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} end to="/buyer">Browse lots</NavLink>
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} to="/buyer/bids">My bids <strong>{bids.length}</strong></NavLink>
      </nav>
      <div className="buyer-my-bids-title">
        <div><p className="eyebrow">BUYER ACTIVITY</p><h2>Your recent bids</h2></div>
        <strong>{bids.length} active</strong>
      </div>
      {bids.length ? (
        <div className="buyer-my-bids-list">
          {bids.map(({ lot, ...bid }) => (
            <article className="buyer-my-bid-card" key={bid.id}>
              <span className="buyer-crop-icon" aria-hidden="true">♧</span>
              <div><strong>{lot.crop} · Grade {lot.grade}</strong><small>{bid.age} · {bid.paymentCategory === "today" ? "Today" : bid.paymentCategory === "soon" ? "Within 7 days" : "On credit"}</small><small>{lot.id.toUpperCase()} · {formatWeight(lot.weightKg)} · {lot.destination}</small></div>
              <strong className="buyer-my-bid-price">{formatPrice(bid.pricePerKg)}</strong>
              <Link aria-label={`View ${lot.crop} lot`} to={`/buyer/lots/${lot.id}`}>›</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="buyer-no-bids">
          <p>You haven’t placed any bids yet.</p>
          <Link className="button-primary" to="/buyer">Browse open lots</Link>
        </div>
      )}
    </section>
  );
}
