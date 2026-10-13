import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BidActivityCard from "../../components/BidActivityCard";
import type { Lot } from "../../types";
import { useLots } from "../../hooks/useLots";
import { formatWeight } from "../../utils/format";

type QueueFilter = "To grade" | "Graded and ready" | "Sent to hub" | "Open to buyers";

const lotCodes: Record<string, string> = {
  lemon: "DM-2411",
  ginger: "DM-2408",
  turmeric: "DM-2398",
};

function matchesFilter(lot: Lot, filter: QueueFilter): boolean {
  if (filter === "To grade") return lot.status === "At spoke" || lot.grade === "Pending";
  if (filter === "Graded and ready") return lot.status === "Graded";
  if (filter === "Open to buyers") return lot.status === "Open for bids";
  return lot.status === "In transit" || lot.status === "At hub" || lot.status === "Verified" || lot.status === "Sold";
}

function statusLabel(lot: Lot): string {
  if (lot.status === "At spoke" || lot.grade === "Pending") return "At Spoke waiting for grading";
  if (lot.status === "Graded") return "Graded and ready";
  if (lot.status === "In transit") return "Sent to hub";
  if (lot.status === "Open for bids") return "Open to buyers";
  if (lot.status === "At hub" || lot.status === "Verified") return "At hub";
  return "Completed";
}

export default function SpokeDashboard() {
  const { user } = useAuth();
  const { lots, gradeLot, addLot, updateLotStatus } = useLots();
  const queueCounts = {
    toGrade: lots.filter((lot) => matchesFilter(lot, "To grade")).length,
    ready: lots.filter((lot) => lot.status === "Graded").length,
    sent: lots.filter((lot) => matchesFilter(lot, "Sent to hub")).length,
    openToBuyers: lots.filter((lot) => matchesFilter(lot, "Open to buyers")).length,
  };
  const [filter, setFilter] = useState<QueueFilter>("To grade");
  const [showAllLots, setShowAllLots] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState(() => (
    lots.find((lot) => matchesFilter(lot, "To grade"))?.id ?? lots[0]?.id ?? ""
  ));
  const visibleLots = useMemo(() => lots.filter((lot) => (
    (showAllLots || matchesFilter(lot, filter)) &&
    `${lot.id} ${lot.crop} ${lot.farmer}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )), [filter, lots, search, showAllLots]);
  const selectedLot = lots.find((lot) => lot.id === selectedLotId) ?? visibleLots[0] ?? lots[0];
  const [actualWeight, setActualWeight] = useState(selectedLot?.weightKg.toString() ?? "");
  const [destination, setDestination] = useState(selectedLot?.destination ?? "Karbi Hub");
  const [grade, setGrade] = useState("A");
  const [photoName, setPhotoName] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [showAddLot, setShowAddLot] = useState(false);
  const [newCrop, setNewCrop] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newFarmer, setNewFarmer] = useState(user?.name ?? "");
  const [newDestination, setNewDestination] = useState("Karbi Hub");
  const [addLotError, setAddLotError] = useState("");
  const [today] = useState(() => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date()).toUpperCase());

  function selectLot(lot: Lot) {
    setSelectedLotId(lot.id);
    setActualWeight(String(lot.weightKg));
    setDestination(lot.destination);
    setGrade(lot.grade === "Pending" ? "A" : lot.grade);
    setPhotoName("");
    setNotice("");
    setFormError("");
  }

  function handleGradeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weightKg = Number(actualWeight);
    if (!selectedLot || !Number.isFinite(weightKg) || weightKg <= 0) {
      setFormError("Enter a valid actual weight greater than zero.");
      return;
    }

    gradeLot(selectedLot.id, grade, weightKg, destination);
    setFilter("Graded and ready");
    setNotice(`${selectedLot.crop} was graded and is ready to dispatch.`);
    setFormError("");
  }

  function handleAddLot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weightKg = Number(newWeight);
    if (!newCrop.trim() || !newFarmer.trim() || !Number.isFinite(weightKg) || weightKg <= 0) {
      setAddLotError("Enter a crop, farmer, and valid declared weight.");
      return;
    }

    const id = addLot({
      crop: newCrop.trim(),
      weightKg,
      farmer: newFarmer.trim(),
      destination: newDestination,
    });
    setFilter("To grade");
    setSearch("");
    setSelectedLotId(id);
    setActualWeight(String(weightKg));
    setDestination(newDestination);
    setGrade("A");
    setShowAddLot(false);
    setNewCrop("");
    setNewWeight("");
    setAddLotError("");
    setNotice(`${newCrop.trim()} added to the grading queue.`);
  }

  function handleOpenForBids(lot: Lot) {
    if (lot.status !== "Graded") return;
    updateLotStatus(lot.id, "Open for bids", 4);
    setFilter("Open to buyers");
    setShowAllLots(false);
    setNotice(`${lot.crop} is now open for buyers to bid.`);
  }

  function handleSendToHub(lot: Lot) {
    if (lot.status !== "Graded") return;
    updateLotStatus(lot.id, "In transit", 3);
    setFilter("Sent to hub");
    setShowAllLots(false);
    setNotice(`${lot.crop} has been sent to ${lot.destination}.`);
  }

  return (
    <section className="page-container spoke-dashboard">
      <div className="spoke-title-row">
        <div>
          <p className="eyebrow">SPOKE OPERATIONS · {today}</p>
          <h1>Diphu Spoke</h1>
          <p className="spoke-subtitle">Grade incoming harvest, list lots, and keep the hub moving.</p>
        </div>
        <button className="button-primary spoke-add-button" onClick={() => setShowAddLot(true)} type="button">＋ <span>Add lot</span></button>
      </div>

      <div className="spoke-stat-grid" aria-label="Spoke summary">
        <article className="spoke-stat-card waiting">
          <span>Waiting for grading</span><strong>{queueCounts.toGrade}</strong><small>in the live queue</small><span className="spoke-stat-icon" aria-hidden="true">▧</span>
        </article>
        <article className="spoke-stat-card">
          <span>Expected from farms</span><strong>{formatWeight(lots.filter((lot) => lot.status === "At spoke").reduce((total, lot) => total + lot.weightKg, 0))}</strong><small>at this spoke</small><span className="spoke-stat-icon" aria-hidden="true">⇢</span>
        </article>
        <article className="spoke-stat-card ready">
          <span>Ready to dispatch</span><strong>{formatWeight(lots.filter((lot) => lot.status === "Graded").reduce((total, lot) => total + lot.weightKg, 0))}</strong><small>{queueCounts.ready} lots</small><span className="spoke-stat-icon" aria-hidden="true">◇</span>
        </article>
        <article className="spoke-stat-card">
          <span>Graded stock in kg</span><strong>{formatWeight(lots.filter((lot) => ["Graded", "In transit", "At hub", "Verified", "Open for bids"].includes(lot.status)).reduce((total, lot) => total + lot.weightKg, 0))}</strong><small>in the supply chain</small><span className="spoke-stat-icon" aria-hidden="true">✓</span>
        </article>
      </div>

      <div className="spoke-queue-controls">
        <div className="spoke-filter-tabs" aria-label="Filter lot queue">
          <span className="filter-caption">▽ &nbsp;Show</span>
          {([
            ["To grade", queueCounts.toGrade],
            ["Graded and ready", queueCounts.ready],
            ["Sent to hub", queueCounts.sent],
            ["Open to buyers", queueCounts.openToBuyers],
          ] as const).map(([label, count]) => (
            <button
              aria-pressed={filter === label}
              className={`spoke-filter-tab${filter === label ? " selected" : ""}`}
              key={label}
              onClick={() => {
                setShowAllLots(false);
                setFilter(label);
              }}
              type="button"
            >
              {label}{(label === "To grade" || label === "Open to buyers") && <strong>{count}</strong>}
            </button>
          ))}
        </div>
        <label className="spoke-search">
          <span aria-hidden="true">⌕</span>
          <input onChange={(event) => setSearch(event.target.value)} placeholder="Search lot or farmer" value={search} />
        </label>
      </div>

      <section aria-labelledby="live-queue-heading" className="spoke-queue-card">
        <div className="spoke-queue-heading">
        <div><p className="eyebrow">LIVE LOT QUEUE</p><h2 id="live-queue-heading">{showAllLots ? "All lots" : filter} <span>{visibleLots.length}</span></h2></div>
          <span aria-hidden="true" className="queue-filter-icon">▽</span>
        </div>
        <div className="spoke-table-scroll">
          <table className="spoke-lot-table">
            <thead>
              <tr><th>Lot ID</th><th>Farmer</th><th>Crop</th><th>Declared kg</th><th>Grade</th><th>Hub</th><th>Status</th><th aria-label="Action" /></tr>
            </thead>
            <tbody>
              {visibleLots.map((lot) => (
                <tr className={selectedLot?.id === lot.id ? "selected" : ""} key={lot.id} onClick={() => selectLot(lot)}>
                  <td><strong>{lotCodes[lot.id] ?? `DM-${lot.id.slice(-4)}`}</strong><small>08 Oct · 09:24</small></td>
                  <td><span className="spoke-farmer"><span>{lot.farmer.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</span>{lot.farmer}</span></td>
                  <td><span className="spoke-crop">♧ &nbsp;{lot.crop}</span></td>
                  <td>{lot.weightKg.toLocaleString("en-IN")}</td>
                  <td>{lot.grade === "Pending" ? "—" : `Grade ${lot.grade}`}</td>
                  <td>{lot.destination}</td>
                  <td><span className={`spoke-status-pill${lot.status === "At spoke" ? " waiting" : lot.status === "Graded" ? " ready" : ""}`}>{statusLabel(lot)}</span></td>
                  <td>
                    {lot.status === "At spoke" || lot.grade === "Pending"
                      ? <button className="spoke-grade-button" onClick={(event) => { event.stopPropagation(); selectLot(lot); }} type="button">Grade lot ›</button>
                      : lot.status === "Graded"
                        ? <span className="spoke-row-actions">
                            <button className="spoke-grade-button" onClick={(event) => { event.stopPropagation(); handleSendToHub(lot); }} type="button">Send to hub</button>
                            <button className="spoke-row-action-secondary" onClick={(event) => { event.stopPropagation(); handleOpenForBids(lot); }} type="button">Open to buyers</button>
                          </span>
                      : <Link className="spoke-view-link" onClick={(event) => event.stopPropagation()} to={`/spoke/lots/${lot.id}/grade`}>View lot ›</Link>}
                  </td>
                </tr>
              ))}
              {!visibleLots.length && <tr><td className="spoke-empty-row" colSpan={8}>No lots match this queue and search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="spoke-queue-footer"><span>Showing {visibleLots.length} of {lots.length} lots</span><button onClick={() => { setShowAllLots(true); setSearch(""); }} type="button">View all lots →</button></div>
      </section>

      {selectedLot && (
        <form className="spoke-grade-workspace" onSubmit={handleGradeSubmit}>
          <div className="spoke-workspace-heading">
            <div><p className="eyebrow">NEXT ACTION</p><h2>Grade lot <small>{selectedLot.id.toUpperCase()}</small></h2><p>{selectedLot.crop} · {selectedLot.farmer} · declared {formatWeight(selectedLot.weightKg)}</p></div>
            <span className={`spoke-status-pill${selectedLot.status === "At spoke" ? " waiting" : " ready"}`}>{statusLabel(selectedLot)}</span>
          </div>
          {notice && <p className="spoke-notice" role="status">{notice}</p>}
          <div className="spoke-grade-grid">
            <label className="spoke-photo-upload">
              <input accept="image/jpeg,image/png" onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")} type="file" />
              <span className="camera-icon" aria-hidden="true">▣</span>
              <strong>{photoName || "Upload produce photo"}</strong>
              <small>JPG or PNG · up to 10 MB</small>
              <span className="choose-file">♧ &nbsp;Choose file</span>
            </label>
            <div className="spoke-grade-fields">
              <label className="spoke-field">Actual weight
                <span><input min="1" onChange={(event) => setActualWeight(event.target.value)} type="number" value={actualWeight} /><small>kg</small></span>
              </label>
              <label className="spoke-field">Send to hub
                <select onChange={(event) => setDestination(event.target.value)} value={destination}>
                  <option>Karbi Hub</option><option>East Hub</option><option>Diphu Hub</option>
                </select>
              </label>
              <fieldset className="spoke-grade-picker">
                <legend>Choose grade</legend>
                <div>
                  {[["A", "Premium"], ["B", "Good"], ["C", "Needs review"]].map(([value, description]) => (
                    <label className={grade === value ? "selected" : ""} key={value}>
                      <input checked={grade === value} name="spoke-grade" onChange={() => setGrade(value)} type="radio" value={value} />
                      <strong>{value}</strong><small>{description}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
              {formError && <p className="form-error" role="alert">{formError}</p>}
            </div>
            <div className="spoke-save-column">
              <div className="spoke-price-note"><small>Suggested starting bid</small><strong>₹{selectedLot.bids.length ? Math.max(...selectedLot.bids.map((bid) => bid.pricePerKg)) : 48}/kg</strong><span>Open the graded lot when it is ready for buyers.</span></div>
              <button className="button-primary spoke-save-button" type="submit">⇧ &nbsp; Save grade and ready for hub</button>
              {selectedLot.status === "Graded" && (
                <>
                  <button className="button-secondary spoke-save-button" onClick={() => handleSendToHub(selectedLot)} type="button">Send to hub</button>
                  <button className="button-secondary spoke-save-button" onClick={() => handleOpenForBids(selectedLot)} type="button">Open lot to buyers for bidding</button>
                </>
              )}
            </div>
          </div>
        </form>
      )}

      <BidActivityCard />

      {showAddLot && (
        <div className="spoke-modal-backdrop" onClick={() => setShowAddLot(false)} role="presentation">
          <form aria-labelledby="add-lot-title" className="spoke-add-lot-modal" onClick={(event) => event.stopPropagation()} onSubmit={handleAddLot}>
            <div><h2 id="add-lot-title">Add a lot</h2><button aria-label="Close add lot form" onClick={() => setShowAddLot(false)} type="button">×</button></div>
            <label>Crop<input autoFocus onChange={(event) => setNewCrop(event.target.value)} placeholder="e.g. Lemon" value={newCrop} /></label>
            <label>Declared weight (kg)<input min="1" onChange={(event) => setNewWeight(event.target.value)} type="number" value={newWeight} /></label>
            <label>Farmer<input onChange={(event) => setNewFarmer(event.target.value)} value={newFarmer} /></label>
            <label>Send to hub<select onChange={(event) => setNewDestination(event.target.value)} value={newDestination}><option>Karbi Hub</option><option>East Hub</option><option>Diphu Hub</option></select></label>
            {addLotError && <p className="form-error" role="alert">{addLotError}</p>}
            <button className="button-primary" type="submit">Add to grading queue</button>
          </form>
        </div>
      )}
    </section>
  );
}
