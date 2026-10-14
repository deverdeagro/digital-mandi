import { Link, useParams } from "react-router-dom";
import LotTracker from "../../components/LotTracker";
import StatusChip from "../../components/StatusChip";
import { useLots } from "../../hooks/useLots";
import { formatWeight } from "../../utils/format";

export default function BuyerLotDetail() {
  const { lotId } = useParams();
  const { getLot } = useLots();
  const lot = getLot(lotId);

  if (!lot) return <section className="page-container"><p className="empty-state">That lot could not be found.</p><Link className="quiet-link" to="/buyer">Back to marketplace</Link></section>;

  return (
    <section className="page-container narrow-page">
      <Link className="quiet-link" to="/buyer">← Marketplace</Link>
      <div className="page-heading"><div><p className="eyebrow">{lot.variety}</p><h1>{lot.crop}</h1></div><StatusChip status={lot.status} /></div>
      <article className="lot-card-shared detail-card">
        <div className="detail-facts"><span>Available<strong>{formatWeight(lot.weightKg)}</strong></span><span>Quality grade<strong>{lot.grade}</strong></span><span>Farmer<strong>{lot.farmer}</strong></span><span>Origin<strong>{lot.origin}</strong></span></div>
        <LotTracker stage={lot.stage} />
      </article>
      <article className="action-card">
        <h2>Make an offer</h2>
        <p>Place a competitive bid on this graded lot. Your offer will be visible to the farmer.</p>
        <Link className="button-primary" to={`/buyer/lots/${lot.id}/bids`}>View bids and place offer</Link>
      </article>
    </section>
  );
}
