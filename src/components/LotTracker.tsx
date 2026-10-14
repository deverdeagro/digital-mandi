const stages = ["Farm gate", "Spoke", "Hub", "Buyer"];

export default function LotTracker({ stage }: { stage: number }) {
  return (
    <div aria-label={`Lot journey, stage ${stage} of ${stages.length}`} className="lot-tracker">
      <div className="tracker-line" />
      {stages.map((label, index) => {
        const number = index + 1;
        const complete = number < stage;
        const current = number === stage;
        return (
          <div className={`tracker-step${complete ? " complete" : ""}${current ? " current" : ""}`} key={label}>
            <span>{complete ? "✓" : number}</span>
            <small>{label}</small>
          </div>
        );
      })}
    </div>
  );
}
