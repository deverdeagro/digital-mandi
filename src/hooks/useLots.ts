import { useContext } from "react";
import { LotsContext } from "../context/LotsContext";

export function useLots() {
  const context = useContext(LotsContext);
  if (!context) throw new Error("useLots must be used inside LotsProvider.");
  return context;
}
