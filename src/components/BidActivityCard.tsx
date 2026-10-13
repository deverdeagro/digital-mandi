import { useMemo } from "react";
import { useLots } from "../hooks/useLots";

export default function SpokeBidActivityCard({ type = "spoke" }: { type?: "spoke" | "hub" }) {
  const { lots } = useLots();
  const bids = useMemo(() => lots
    .filter((lot) => lot.status === "Open for bids" && (type === "hub"
      ? lot.destination.toLowerCase().includes("karbi")
      : lot.origin.toLowerCase().includes("diphu")))
    .flatMap((lot) => lot.bids.map((bid) => ({ ...bid, crop: lot.crop })))
    .sort((left, right) => right.pricePerKg - left.pricePerKg), [lots, type]);
  const topBids = bids.slice(0, 3);
  const titleId = `${type}-bid-activity-title`;

  return (
    <section aria-labelledby={titleId} className="spoke-bid-activity-card">
      <div className="spoke-bid-activity-heading">
        <div>
          <p className="eyebrow">{type === "hub" ? "HUB BID ACTIVITY" : "SPOKE BID ACTIVITY"}</p>
          <h2 id={titleId}>{type === "hub" ? "Buyer bids on Karbi Hub lots" : "Buyer bids on Diphu lots"}</h2>
        </div>
        <strong>{bids.length} buyer bids</strong>
      </div>
      {topBids.length ? (
        <div className="spoke-activity-bid-list">
          {topBids.map((bid) => {
            const initials = bid.buyer.split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
            const termsLabel = bid.paymentCategory === "today" ? "Today" : bid.paymentCategory === "soon" ? "Within 7 days" : "On credit";
            return (
              <article className="spoke-activity-bid" key={bid.id}>
                <span className="spoke-activity-avatar">{initials}</span>
                <div className="spoke-activity-buyer">
                  <strong>{bid.buyer}</strong>
                  <small>{bid.age} · {termsLabel}</small>
                  <span className={`farmer-payment-terms ${bid.paymentCategory}`}>{termsLabel}</span>
                </div>
                <strong className="spoke-activity-price">₹{bid.pricePerKg}/kg</strong>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">No buyer bids have been placed on {type === "hub" ? "Karbi Hub" : "Diphu"} lots yet.</p>
      )}
    </section>
  );
}
