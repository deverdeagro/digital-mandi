import type { LotWeightDiscrepancy } from "../types";

const WEIGHT_DISCREPANCY_THRESHOLD = 2;

export function calculateWeightDiscrepancy(
  spokeWeightKg: number | undefined,
  hubWeightKg: number,
): LotWeightDiscrepancy | undefined {
  if (
    spokeWeightKg === undefined
    || !Number.isFinite(spokeWeightKg)
    || spokeWeightKg <= 0
    || !Number.isFinite(hubWeightKg)
    || hubWeightKg <= 0
  ) {
    return undefined;
  }

  const differenceKg = Math.abs(hubWeightKg - spokeWeightKg);
  const percentage = (differenceKg / spokeWeightKg) * 100;

  return {
    spokeWeightKg,
    hubWeightKg,
    differenceKg,
    percentage,
    requiresReview: percentage > WEIGHT_DISCREPANCY_THRESHOLD,
  };
}
