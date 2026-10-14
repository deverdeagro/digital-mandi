import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusChip from "../../components/StatusChip";
import { useLots } from "../../hooks/useLots";
import { formatWeight } from "../../utils/format";

export default function GradeLot() {
  const { lotId } = useParams();
  const { getLot, gradeLot } = useLots();
  const lot = getLot(lotId);
  const navigate = useNavigate();
  const [grade, setGrade] = useState(lot?.grade === "Pending" ? "A" : lot?.grade ?? "A");
  const [actualWeight, setActualWeight] = useState(lot?.weightKg.toString() ?? "");
  const [destination, setDestination] = useState(lot?.destination ?? "Karbi Hub");
  const [photoName, setPhotoName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weightKg = Number(actualWeight);
    if (!lot || !Number.isFinite(weightKg) || weightKg <= 0) {
      setError("Enter a valid actual weight greater than zero.");
      return;
    }

    gradeLot(lot.id, grade, weightKg, destination);
    navigate("/spoke");
  }

  if (!lot) {
    return (
      <section className="page-container">
        <p className="empty-state">That lot could not be found.</p>
        <Link className="quiet-link" to="/spoke">Back to incoming lots</Link>
      </section>
    );
  }

  return (
    <section className="page-container spoke-grade-page">
      <Link className="quiet-link" to="/spoke">← Back to incoming lots</Link>
      <form className="spoke-grade-workspace standalone-grade-workspace" onSubmit={handleSubmit}>
        <div className="spoke-workspace-heading">
          <div>
            <p className="eyebrow">NEXT ACTION</p>
            <h1>Grade lot <small>{lot.id.toUpperCase()}</small></h1>
            <p>{lot.crop} · {lot.farmer} · declared {formatWeight(lot.weightKg)}</p>
          </div>
          <StatusChip
            label={lot.status === "At spoke" || lot.grade === "Pending" ? "At Spoke waiting for grading" : lot.status}
            status={lot.status}
          />
        </div>
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
                    <input checked={grade === value} name="standalone-spoke-grade" onChange={() => setGrade(value)} type="radio" value={value} />
                    <strong>{value}</strong><small>{description}</small>
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
          <div className="spoke-save-column">
            <div className="spoke-price-note">
              <small>Listing after save</small>
              <strong>₹{lot.bids.length ? Math.max(...lot.bids.map((bid) => bid.pricePerKg)) : 48}/kg starting bid</strong>
              <span>Buyers can bid once the lot is listed.</span>
            </div>
            <button className="button-primary spoke-save-button" type="submit">⇧ &nbsp; Save grade and list lot</button>
          </div>
        </div>
      </form>
    </section>
  );
}
