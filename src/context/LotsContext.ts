import { createContext } from "react";
import type { Lot, LotBid, NewLotInput } from "../types";

export interface LotsContextValue {
  lots: Lot[];
  getLot: (id: string | undefined) => Lot | undefined;
  gradeLot: (id: string, grade: string, weightKg: number, destination: string) => void;
  recordHubWeight: (id: string, grade: string, weightKg: number, destination: string) => void;
  addLot: (lot: NewLotInput) => string;
  updateLotStatus: (id: string, status: Lot["status"], stage: number, destination?: string) => void;
  addBid: (id: string, bid: LotBid) => void;
  acceptBid: (id: string) => void;
}

export const LotsContext = createContext<LotsContextValue | null>(null);
