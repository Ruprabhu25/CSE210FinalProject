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
 * @param {number} tolerance - allowed deviation without penalty 
 * @returns {number} Normalized score
 */
export function deviationToScore(deviation, tolerance = 0.2) {
  if (deviation < tolerance) return 1;
  return Math.max(0.1, 1 - deviation);
}
