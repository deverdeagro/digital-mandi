export type Role = "farmer" | "spoke" | "hub" | "buyer";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export type LotStatus =
  | "At spoke"
  | "Graded"
  | "In transit"
  | "At hub"
  | "Verified"
  | "Open for bids"
  | "Sold";

export interface LotBid {
  id: string;
  buyer: string;
  pricePerKg: number;
  paymentTerms: string;
  age: string;
  paymentCategory: "today" | "soon" | "credit";
}

export interface LotWeightDiscrepancy {
  spokeWeightKg: number;
  hubWeightKg: number;
  differenceKg: number;
  percentage: number;
  requiresReview: boolean;
}

export interface Lot {
  id: string;
  crop: string;
  variety: string;
  weightKg: number;
  spokeWeightKg?: number;
  hubWeightKg?: number;
  weightDiscrepancy?: LotWeightDiscrepancy;
  farmer: string;
  origin: string;
  destination: string;
  grade: string;
  status: LotStatus;
  stage: number;
  bids: LotBid[];
}

export interface NewLotInput {
  crop: string;
  weightKg: number;
  farmer: string;
  destination: string;
}
