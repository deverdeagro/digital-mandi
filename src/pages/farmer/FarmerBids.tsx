import { NavLink, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useLots } from "../../hooks/useLots";
import { formatAmount, formatPrice, formatWeight } from "../../utils/format";
import FarmerGreeting from "./components/FarmerGreeting";

export default function FarmerBids() {
  const [searchParams] = useSearchParams();
  const { lots, getLot, acceptBid } = useLots();
  const lot = getLot(searchParams.get("lot") ?? undefined) ?? lots[0];
  const [acceptedBid, setAcceptedBid] = useState<string | null>(null);
  const bidCount = lots.reduce((total, item) => total + item.bids.length, 0);
  const openLots = lots.filter((item) => item.status === "Open for bids" || item.status === "In transit").length;

  return (
    <section className="page-container farmer-page-container farmer-bids-page">
      <FarmerGreeting />
      <div className="dashboard-stats" aria-label="Season summary">
        <article><span>Lots</span><strong>4</strong><small>this season</small></article>
        <article><span>Open for bids</span><strong>{openLots}</strong><small>being seen</small></article>
        <article><span>Bids</span><strong>{bidCount}</strong><small>from buyers</small></article>
      </div>
      <nav aria-label="Farmer lots and bids" className="dashboard-tabs">
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} end to="/farmer">My lots</NavLink>
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} to={`/farmer/bids?lot=${lot?.id ?? "lemon"}`}>Bids <strong>{bidCount}</strong></NavLink>
      </nav>
      {!lot ? <p className="empty-state">No lots are available yet.</p> : (
        <>
          <div className="farmer-bids-heading">
            <div>
              <p>{lot.crop.toUpperCase()} · GRADE {lot.grade} · {formatWeight(lot.weightKg).toUpperCase()}</p>
              <h1>Buyer bids</h1>
            </div>
            <strong>{lot.bids.length} bids</strong>
          </div>
          <div className="farmer-bid-list">
            {lot.bids.map((bid, index) => (
              <article className={`farmer-bid-card${index === 0 ? " best-bid" : ""}`} key={bid.id}>
                <span className="farmer-bid-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="farmer-bid-details">
                  <div className="farmer-buyer-name">
                    <h2>{bid.buyer}</h2>
                    {index === 0 && <span className="farmer-highest-badge">Highest</span>}
                  </div>
                  <p className="farmer-bid-age">{bid.age}</p>
                  <span className={`farmer-payment-terms ${bid.paymentCategory}`}>₹ &nbsp;{bid.paymentTerms}</span>
                </div>
                <div className="farmer-bid-price">
                  <strong>{formatPrice(bid.pricePerKg)}</strong>
                  <span>{formatAmount(bid.pricePerKg * lot.weightKg)}</span>
                </div>
                <button
                  className={`farmer-accept-bid${acceptedBid === bid.id ? " accepted" : ""}`}
                  disabled={lot.status === "Sold" && acceptedBid !== bid.id}
                  onClick={() => {
                    acceptBid(lot.id);
                    setAcceptedBid(bid.id);
                  }}
                  type="button"
                >
                  {acceptedBid === bid.id ? "Accepted" : lot.status === "Sold" ? "Lot sold" : "Accept"}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
