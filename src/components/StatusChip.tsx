import type { LotStatus } from "../types";

export default function StatusChip({ status, label }: { status: LotStatus; label?: string }) {
  const tone = status === "Sold" ? "sold" : status === "Open for bids" ? "open" : "progress";
  return <span className={`status-chip ${tone}`}>{label ?? status}</span>;
}
