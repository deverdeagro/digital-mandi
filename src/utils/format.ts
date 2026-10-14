export function formatWeight(weightKg: number): string {
  return `${weightKg.toLocaleString("en-IN")} kg`;
}

export function formatPrice(pricePerKg: number): string {
  return `₹${pricePerKg.toLocaleString("en-IN")}/kg`;
}

export function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
