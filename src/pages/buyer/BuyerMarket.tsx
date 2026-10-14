import { useMemo, useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLots } from "../../hooks/useLots";
import type { Lot, LotBid } from "../../types";
import { formatPrice, formatWeight } from "../../utils/format";

const paymentLabels: Record<LotBid["paymentCategory"], string> = {
  today: "Today",
  soon: "Within 7 days",
  credit: "On credit",
};

function currentAsk(lot: Lot): number {
  return lot.bids.length ? Math.max(...lot.bids.map((bid) => bid.pricePerKg)) : 0;
}

export default function BuyerMarket() {
  const { user } = useAuth();
  const { lots, addBid } = useLots();
  const marketLots = useMemo(() => lots.filter((lot) => lot.status === "Open for bids"), [lots]);
  const [selectedLotId, setSelectedLotId] = useState(() => marketLots[0]?.id ?? "");
  const selectedLot = marketLots.find((lot) => lot.id === selectedLotId) ?? marketLots[0];
  const myBids = lots.flatMap((lot) => lot.bids.filter((bid) => bid.buyer === user?.name).map((bid) => ({ ...bid, lotId: lot.id })));
  const [price, setPrice] = useState(selectedLot && currentAsk(selectedLot) ? String(currentAsk(selectedLot)) : "");
  const [paymentCategory, setPaymentCategory] = useState<LotBid["paymentCategory"]>("today");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  });

  function selectLot(lot: Lot) {
    setSelectedLotId(lot.id);
    setPrice(currentAsk(lot) ? String(currentAsk(lot)) : "");
    setMessage("");
    setError("");
  }

  function handleBidSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pricePerKg = Number(price);
    if (!selectedLot || !Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      setError("Enter a valid bid price greater than zero.");
      return;
    }
    addBid(selectedLot.id, {
      id: `${selectedLot.id}-${Date.now()}`,
      buyer: user?.name ?? "Buyer",
      pricePerKg,
      paymentTerms: paymentCategory === "today" ? "Pays today" : paymentCategory === "soon" ? "Pays within 7 days" : "Pays on credit",
      age: "Just now",
      paymentCategory,
    });
    setMessage(`Your bid on ${selectedLot.crop} has been placed.`);
    setError("");
  }

  return (
    <section className="page-container buyer-page-container">
      <header className="buyer-greeting">
        <p className="eyebrow">BUYER WORKSPACE</p>
        <h1>{greeting},<br /><span>{user?.name ?? "Buyer"}.</span></h1>
        <p>Find graded lots ready for your next shipment.</p>
      </header>

      <div aria-label="Marketplace summary" className="dashboard-stats buyer-stats">
        <article><strong>{marketLots.length}</strong><span>Open lots</span></article>
        <article><strong>{myBids.length}</strong><span>Active bids</span></article>
        <article><strong>{lots.filter((lot) => lot.status === "At hub" || lot.status === "Verified" || lot.status === "Open for bids" || lot.status === "Sold").length}</strong><span>Stored</span></article>
      </div>

      <nav aria-label="Browse lots and bids" className="dashboard-tabs buyer-tabs">
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} end to="/buyer">Browse lots</NavLink>
        <NavLink className={({ isActive }) => `dashboard-tab${isActive ? " selected" : ""}`} to="/buyer/bids">My bids <strong>{myBids.length}</strong></NavLink>
      </nav>

      {marketLots.length ? (
        <>
          <div aria-label="Open lots" className="buyer-lot-list">
            {marketLots.map((lot) => {
              const topBid = currentAsk(lot);
              const selected = selectedLot?.id === lot.id;
              return (
                <button aria-pressed={selected} className={`buyer-lot-option${selected ? " selected" : ""}`} key={lot.id} onClick={() => selectLot(lot)} type="button">
                  <span className="buyer-crop-icon" aria-hidden="true">♧</span>
                  <span className="buyer-lot-copy"><strong>{lot.crop} · Grade {lot.grade}</strong><small>{lot.id.toUpperCase()} · {formatWeight(lot.weightKg)} · {lot.destination}</small></span>
                  <span className="buyer-lot-price">{topBid ? formatPrice(topBid) : "Make an offer"}<small>{lot.bids.at(-1)?.paymentTerms.replace("Pays ", "") ?? "Place a bid"}</small></span>
                  <span className="buyer-lot-chevron" aria-hidden="true">›</span>
                </button>
              );
            })}
          </div>

          {selectedLot && (
            <article className="buyer-selected-lot">
              <div className="buyer-selected-heading">
                <p className="eyebrow">SELECTED LOT · {selectedLot.id.toUpperCase()}</p>
                <h2>{selectedLot.crop} <span className="grade-badge">Grade {selectedLot.grade}</span></h2>
                <p>{selectedLot.farmer} · {formatWeight(selectedLot.weightKg)}</p>
              </div>
              <span className="buyer-lot-status">Graded and open for bids</span>
              <div className="buyer-route">{selectedLot.origin}<span>→</span>{selectedLot.destination}</div>
              <div className="buyer-lot-facts">
                <span><small>Spoke weight</small><strong>{formatWeight(selectedLot.weightKg)}</strong></span>
                <span><small>Quality</small><strong>Grade {selectedLot.grade}</strong></span>
                <span><small>Current ask</small><strong>{currentAsk(selectedLot) ? formatPrice(currentAsk(selectedLot)) : "No bids yet"}</strong></span>
              </div>
              <form className="buyer-bid-form" onSubmit={handleBidSubmit} noValidate>
                <h3>Buy or place a bid</h3>
                <label>Price per kg
                  <span className="buyer-form-input"><input min="1" onChange={(event) => { setPrice(event.target.value); setMessage(""); setError(""); }} type="number" value={price} /><small>₹ / kg</small></span>
                </label>
                <label>Payment term
                  <select onChange={(event) => setPaymentCategory(event.target.value as LotBid["paymentCategory"])} value={paymentCategory}>
                    {Object.entries(paymentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                {message && <p className="success-message" role="status">{message}</p>}
                <button className="button-primary" type="submit">Place bid <span aria-hidden="true">→</span></button>
              </form>
            </article>
          )}
        </>
      ) : (
        <p className="empty-state">There are no lots open for bids right now.</p>
      )}
    </section>
  );
}
