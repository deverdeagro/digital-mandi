import { useMemo, useState, type FormEvent } from "react";
import BidActivityCard from "../../components/BidActivityCard";
import { formatWeight } from "../../utils/format";
import { useLots } from "../../hooks/useLots";
import type { Lot } from "../../types";

const HUB_NAME = "Karbi Hub";

function belongsToHub(lot: Lot) {
  return lot.destination.toLowerCase().includes("karbi");
}

function HubLotCard({
  lot,
  column,
  onArrive,
  onVerify,
  onOpenBids,
}: {
  lot: Lot;
  column: "transit" | "check" | "stored";
  onArrive?: (lot: Lot) => void;
  onVerify: (lot: Lot, weightKg: number, grade: string) => void;
  onOpenBids?: (lot: Lot) => void;
}) {
  const [checkedWeight, setCheckedWeight] = useState(String(lot.hubWeightKg ?? lot.weightKg));
  const [grade, setGrade] = useState(lot.grade === "Pending" ? "A" : lot.grade);
  const [error, setError] = useState("");

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weightKg = Number(checkedWeight);
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      setError("Enter a valid checked weight.");
      return;
    }
    setError("");
    onVerify(lot, weightKg, grade);
  }

  return (
    <article className={`hub-lot-card ${column}`}>
      <div className="hub-lot-card-top">
        <span className="hub-lot-id"><i />{lot.id.toUpperCase()}</span>
        {column === "stored" ? <span className="hub-stored-label">{lot.status === "Sold" ? "Sold" : lot.status === "Open for bids" ? "Open for bids" : "✓ Verified"}</span> : <span className={`hub-lot-dot ${column}`} />}
      </div>
      <div className="hub-lot-title">
        <span className="hub-crop-icon" aria-hidden="true">♧</span>
        <strong>{lot.crop}</strong>
        <span className="hub-grade-chip">Grade {lot.grade}</span>
      </div>
      <div className="hub-farmer">
        <span>{lot.farmer.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
        {lot.farmer}
      </div>
      <div className="hub-route">{lot.origin} <span>→</span> {lot.destination}</div>
      {column === "transit" && (
        <>
          <div className="hub-weight-row"><span>Spoke weight</span><strong>{formatWeight(lot.spokeWeightKg ?? lot.weightKg)}</strong></div>
          <button className="hub-arrival-button" onClick={() => onArrive?.(lot)} type="button">⇢ &nbsp; Mark arrived at hub</button>
        </>
      )}
      {column === "check" && (
        <form className="hub-verify-form" onSubmit={handleVerify}>
          <label>Checked weight
            <span className="hub-verify-input"><input min="1" onChange={(event) => setCheckedWeight(event.target.value)} type="number" value={checkedWeight} /><small>kg</small></span>
          </label>
          <label>Grade
            <select onChange={(event) => setGrade(event.target.value)} value={grade}>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option>
            </select>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button-primary" type="submit">✓ &nbsp; Verify and store</button>
        </form>
      )}
      {column === "stored" && (
        <>
          <div className="hub-weight-row"><span>Spoke weight</span><strong>{formatWeight(lot.spokeWeightKg ?? lot.weightKg)}</strong></div>
          <div className="hub-weight-row"><span>Hub weight</span><strong>{lot.hubWeightKg === undefined ? "Not recorded" : formatWeight(lot.hubWeightKg)}</strong></div>
          {lot.status === "Verified" && (
            <button className="button-primary" onClick={() => onOpenBids?.(lot)} type="button">Open lot to buyers for bidding</button>
          )}
        </>
      )}
    </article>
  );
}

export default function HubDashboard() {
  const { lots, recordHubWeight, updateLotStatus } = useLots();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [today] = useState(() => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()).toUpperCase());

  const hubLots = useMemo(() => lots.filter(belongsToHub), [lots]);
  const filteredLots = useMemo(() => hubLots.filter((lot) => {
    const matchesSearch = `${lot.id} ${lot.crop} ${lot.farmer} ${lot.origin} ${lot.destination}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  }), [hubLots, search]);
  const inTransit = filteredLots.filter((lot) => lot.status === "Graded" || lot.status === "In transit");
  const toCheck = filteredLots.filter((lot) => lot.status === "At hub");
  const stored = filteredLots.filter((lot) => lot.status === "Verified" || lot.status === "Open for bids" || lot.status === "Sold");
  const onTheWayCount = hubLots.filter((lot) => lot.status === "Graded" || lot.status === "In transit").length;
  const toCheckCount = hubLots.filter((lot) => lot.status === "At hub").length;
  const storedWeight = hubLots
    .filter((lot) => lot.status === "Verified" || lot.status === "Open for bids" || lot.status === "Sold")
    .reduce((sum, lot) => sum + lot.weightKg, 0);

  function handleVerify(lot: Lot, weightKg: number, grade: string) {
    recordHubWeight(lot.id, grade, weightKg, lot.destination);
  }

  return (
    <section className="page-container hub-dashboard">
      <header className="hub-dashboard-heading">
        <div>
          <p className="eyebrow">STORAGE AND VERIFICATION · {today}</p>
          <h1>Karbi Hub dashboard</h1>
        </div>
        <div className="hub-header-actions">
          <button className="button-secondary" onClick={() => setShowSearch((current) => !current)} type="button">⌕ &nbsp; Find a lot</button>
        </div>
      </header>

      {showSearch && (
        <label className="hub-search-bar">
          Find a lot by ID, crop, or farmer
          <input autoFocus onChange={(event) => setSearch(event.target.value)} placeholder="Search lots..." value={search} />
        </label>
      )}

      <div aria-label="Karbi Hub summary" className="hub-summary-line">
        <span><strong>{onTheWayCount}</strong> lots on the way</span>
        <span><strong>{toCheckCount}</strong> lots to check</span>
        <span><strong>{formatWeight(storedWeight)}</strong> stored</span>
      </div>

      <div className="hub-board-heading">
        <div><p className="eyebrow">OPERATIONS BOARD</p><h2>{HUB_NAME} <span>● Live</span></h2></div>
        <div className="hub-board-tools">
          <button aria-label="Toggle lot search" className="hub-icon-button" onClick={() => setShowSearch((current) => !current)} type="button">⌕</button>
        </div>
      </div>

      <div className="hub-operations-grid">
        <section className="hub-operations-column transit-column">
          <div className="hub-column-heading"><div><h3>On the way from spokes</h3><p>⇢ &nbsp;Moving toward your hub</p></div><span>{inTransit.length}</span></div>
          <div className="hub-column-cards">
            {inTransit.map((lot) => <HubLotCard column="transit" key={lot.id} lot={lot} onArrive={(currentLot) => updateLotStatus(currentLot.id, "At hub", 3)} onVerify={handleVerify} />)}
            {!inTransit.length && <p className="hub-empty-column">No lots on the way.</p>}
          </div>
        </section>
        <section className="hub-operations-column check-column">
          <div className="hub-column-heading"><div><h3>Arrived, to check</h3><p>ⓘ &nbsp;Verify weight and grade</p></div><span>{toCheck.length}</span></div>
          <div className="hub-column-cards">
            {toCheck.map((lot) => <HubLotCard column="check" key={lot.id} lot={lot} onVerify={handleVerify} />)}
            {!toCheck.length && <p className="hub-empty-column">No arrivals need checking.</p>}
          </div>
        </section>
        <section className="hub-operations-column stored-column">
          <div className="hub-column-heading"><div><h3>Verified and stored</h3><p>♧ &nbsp;Ready for buyer movement</p></div><span>{stored.length}</span></div>
          <div className="hub-column-cards">
            {stored.map((lot) => <HubLotCard column="stored" key={lot.id} lot={lot} onVerify={handleVerify} onOpenBids={(currentLot) => updateLotStatus(currentLot.id, "Open for bids", 4)} />)}
            {!stored.length && <p className="hub-empty-column">No verified stock yet.</p>}
          </div>
        </section>
      </div>

      <BidActivityCard type="hub" />

    </section>
  );
}
