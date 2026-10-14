import type { Lot } from "../types";

const lots: Lot[] = [
  {
    id: "lemon",
    crop: "Lemon",
    variety: "Assam lemon",
    weightKg: 1200,
    farmer: "Ramesh Teron",
    origin: "Diphu Spoke",
    destination: "Karbiang Hub",
    grade: "A",
    status: "Open for bids",
    stage: 4,
    bids: [
      { id: "lemon-1", buyer: "Kolkata Agro", pricePerKg: 48, paymentTerms: "Pays today", age: "12 min ago", paymentCategory: "today" },
      { id: "lemon-2", buyer: "Guwahati Fresh Traders", pricePerKg: 46, paymentTerms: "Pays within 7 days", age: "28 min ago", paymentCategory: "soon" },
      { id: "lemon-3", buyer: "Siliguri Mart", pricePerKg: 44, paymentTerms: "Pays on credit", age: "41 min ago", paymentCategory: "credit" },
    ],
  },
  {
    id: "ginger",
    crop: "Ginger",
    variety: "Naga ginger",
    weightKg: 800,
    farmer: "Ramesh Teron",
    origin: "Diphu Spoke",
    destination: "East Hub",
    grade: "Pending",
    status: "At spoke",
    stage: 1,
    bids: [
      { id: "ginger-1", buyer: "North East Produce", pricePerKg: 62, paymentTerms: "Pays today", age: "18 min ago", paymentCategory: "today" },
      { id: "ginger-2", buyer: "Guwahati Fresh Traders", pricePerKg: 60, paymentTerms: "Pays within 7 days", age: "36 min ago", paymentCategory: "soon" },
    ],
  },
  {
    id: "turmeric",
    crop: "Turmeric",
    variety: "Lakadong turmeric",
    weightKg: 2000,
    farmer: "Ramesh Teron",
    origin: "Diphu Spoke",
    destination: "Karbiang Hub",
    grade: "B",
    status: "At hub",
    stage: 4,
    bids: [
      { id: "turmeric-1", buyer: "Assam Valley Foods", pricePerKg: 39, paymentTerms: "Pays today", age: "15 min ago", paymentCategory: "today" },
      { id: "turmeric-2", buyer: "Kolkata Agro", pricePerKg: 37, paymentTerms: "Pays within 7 days", age: "32 min ago", paymentCategory: "soon" },
      { id: "turmeric-3", buyer: "North East Produce", pricePerKg: 36, paymentTerms: "Pays today", age: "48 min ago", paymentCategory: "today" },
      { id: "turmeric-4", buyer: "Siliguri Mart", pricePerKg: 34, paymentTerms: "Pays on credit", age: "1 hr ago", paymentCategory: "credit" },
    ],
  },
];

export function getLots(): Lot[] {
  return lots.map((lot) => ({ ...lot, bids: lot.bids.map((bid) => ({ ...bid })) }));
}
