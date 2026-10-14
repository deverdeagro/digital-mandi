import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLots } from "../../hooks/useLots";
import { formatAmount, formatPrice } from "../../utils/format";

export default function BuyerBids() {
  const { lotId } = useParams();
  const { user } = useAuth();
  const { getLot, addBid } = useLots();
  const lot = getLot(lotId);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(price);
    if (!lot || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }
    addBid(lot.id, {
      id: `${lot.id}-${Date.now()}`,
      buyer: user?.name ?? "Buyer",
      pricePerKg: amount,
      paymentTerms: "Payment terms to be confirmed",
      age: "Just now",
      paymentCategory: "today",
    });
    setPrice("");
    setError("");
    setMessage("Your bid has been added to this shared lot.");
  }

  if (!lot) return <section className="page-container"><p className="empty-state">That lot could not be found.</p><Link className="quiet-link" to="/buyer">Back to marketplace</Link></section>;

  return (
    <section className="page-container narrow-page">
      <Link className="quiet-link" to={`/buyer/lots/${lot.id}`}>← {lot.crop} lot details</Link>
      <div className="page-heading"><div><p className="eyebrow">BUYER OFFERS</p><h1>Bids for {lot.crop}</h1></div></div>
      <form className="action-card bid-entry-form" onSubmit={handleSubmit} noValidate>
        <h2>Place your offer</h2>
        <label className="field-label" htmlFor="bid-price">Price per kg (₹)</label>
        <input id="bid-price" min="1" onChange={(event) => { setPrice(event.target.value); setMessage(""); setError(""); }} placeholder="e.g. 50" type="number" value={price} />
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="success-message" role="status">{message}</p>}
        <button className="button-primary" type="submit">Submit bid</button>
      </form>
      <div className="section-heading"><div><p className="eyebrow">{lot.bids.length} OFFERS</p><h2>Current bids</h2></div></div>
      <div className="bid-list-shared">
        {lot.bids.map((bid) => (
          <article className="bid-card-shared" key={bid.id}>
            <div><h3>{bid.buyer}</h3><p>{bid.paymentTerms}</p></div>
            <div className="bid-offer"><strong>{formatPrice(bid.pricePerKg)}</strong><span>{formatAmount(bid.pricePerKg * lot.weightKg)} total</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
