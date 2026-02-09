/**
 * Calculates ecosystem health based on species scores and trophic level ratios
 * Health is returned in the range [0, 1], makes it easier to treat health as normalized value
 */
import { IDEAL_RATIOS } from "./ecosystemConfig.js";

/**
 * Calculate species score based on biomass and energy
 * @param {number} population - Number of individuals
 * @param {number} biomassPerIndividual - Biomass per individual
 * @param {number} energyPerIndividual - Energy per individual
 * @param {number} wB - Weight for biomass
 * @param {number} wE - Weight for energy
 * @returns {number} Total species score
 */
function calculateSpeciesScore(population, biomassPerIndividual, energyPerIndividual, wB = 0.5, wE = 0.5) {
  const biomassScore = population * biomassPerIndividual;
  const energyScore = population * energyPerIndividual;
  return wB * biomassScore + wE * energyScore;
}

/**
 * Calculate ecosystem health considering trophic level 
 * @param {Object} speciesByTrophicLevel - Species grouped by trophic level
 *   Structure: {
 *     producer: [{name, population, biomassPerIndividual, energyPerIndividual }, ...],
 *     herbivore: [...], primaryCarnivore: [...], secondaryCarnivore: [...]
 *   }
 * @returns {number} Ecosystem health
 */
export function calculateEcosystemBalance(speciesByTrophicLevel) {
  const sortedLevels = Object.keys(speciesByTrophicLevel).sort(
    (a, b) => IDEAL_RATIOS[a].priority - IDEAL_RATIOS[b].priority
  );

  const levelScores = sortedLevels.map((level) => {
    const species = speciesByTrophicLevel[level] || [];
    let totalScore = 0;
    species.forEach((spec) => {
      totalScore += calculateSpeciesScore(spec.population, spec.biomassPerIndividual, spec.energyPerIndividual);
    });
    return { level, score: totalScore, ideal: IDEAL_RATIOS[level].idealRatio };
  });
  const normalizedScores = levelScores.map((curr, i) => {
    let currScore = curr.score / curr.ideal;
    
    // Penalize based on deviation from next level
    if (i < levelScores.length - 1) {
      const next = levelScores[i + 1];
      const actualRatio = curr.score / (next.score); 
      const idealRatio = curr.ideal / next.ideal;
      const deviation = Math.abs(actualRatio - idealRatio) / idealRatio;
      if (next.score === 0) {
        // Total collapse above this level → severe penalty
        currScore *= 0.1; // or even 0
      } 
      else {
        // Allow ±20% natural tolerance
        if (deviation < 0.2) {
          currScore = 1;
        }
        else{
          // Dynamic penalty: worse imbalance → stronger punishment
          const levelPenalty = Math.max(0.1, 1 - deviation);
          currScore *= levelPenalty;
        }
      }
    }
    const normalizedScore = Math.min(1, currScore);
    return normalizedScore;
  });
  /**
   * Final ecosystem health.
   * Health is the average of all normalized trophic levels
   * Returned in range [0, 1]
   */
  const ecosystemHealth = normalizedScores.reduce((a, b) => a + b, 0) / normalizedScores.length;
  return ecosystemHealth;
}
