/**
 * Calculate deviation between actual and ideal ratio
 * @param {number} actualNumerator
 * @param {number} actualDenominator
 * @param {number} idealNumerator
 * @param {number} idealDenominator
 * @returns {number} Deviation as fraction
 */
export function calculateRatioDeviation(actualNumerator, actualDenominator, idealNumerator, idealDenominator) {
  const actualRatio = actualNumerator / actualDenominator;
  const idealRatio = idealNumerator / idealDenominator;
  const deviation = Math.abs(actualRatio - idealRatio) / idealRatio;
  return deviation;
}

/**
 * Convert deviation into a normalized score [0,1]
 * @param {number} deviation
 * @param {number} tolerance - deviation below this gets a perfect 1.0 (no penalty zone)
 * @returns {number} Normalized score
 *
 * TUNING KNOB — PENALTY_SLOPE
 *   Controls how steeply health drops as ratios go out of balance.
 *   Formula:  score = max(0, 1 - deviation * PENALTY_SLOPE)
 *   1.0 → gentle  (score hits 0 only when deviation ≥ 1.0, i.e. ratio is 2× off)
 *   1.5 → moderate (score hits 0 when deviation ≥ 0.67)   ← current
 *   2.0 → strict   (score hits 0 when deviation ≥ 0.5)
 *   3.0 → harsh    (score hits 0 when deviation ≥ 0.33)
 *
 *   Starting health at each slope (with idealRatios 5:1:0.2:0.04 and default populations):
 *     slope 1.0 → ~89%   (above win threshold, no challenge)
 *     slope 1.5 → ~84%   ← below win threshold, player must improve ecosystem
 *     slope 2.0 → ~79%   (harder starting position)
 *     slope 2.5 → ~73%   (very challenging start)
 */
export function deviationToScore(deviation, tolerance = 0.2) {
  const PENALTY_SLOPE = 1.5;
  if (deviation < tolerance) {
    return 1;
  }
  return Math.max(0, 1 - deviation * PENALTY_SLOPE);
}
