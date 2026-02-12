/**
 * Calculates ecosystem health based on species scores and trophic level ratios
 * Health is returned in the range [0, 1], makes it easier to treat health as normalized value
 */
import { getTotalPopulation, calculateRatioDeviation, deviationToScore } from './helperFunctions/healthCalculateHelperFunctions';

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
 * @param trophicLevels - Array of trophic level objects
 * @param populations - Map of speciesId to Population objects
 * @returns {number} Ecosystem health
 */
export function EcosystemHealth(trophicLevels, populations) {
  let hasExtinction = false;
  const levelScores = trophicLevels.map((trophicLevel) => {
    let totalPop = 0;
    let totalScore = 0;
    const speciesMap = trophicLevel.speciesMap || {};
    const speciesEntries = Object.entries(speciesMap);

    // If no species in this trophic level, consider it extinct
    if (speciesEntries.length === 0) {
      hasExtinction = true;
      return;
    }

    speciesEntries.forEach(([speciesId, speciesData]) => {
      const pop = populations.get(Number(speciesId));
      let size = 0;
      if (pop) {
        size = pop.getCurrentSize();
      }
      if (size === 0) {
        hasExtinction = true;
        return;
      }
      const biomass = speciesData.biomass;
      const energy = speciesData.energy;
      totalPop += size;
      totalScore += calculateSpeciesScore(size, biomass, energy);
    });
    return {level: trophicLevel.name, totalPop: totalPop, score: totalScore, ideal: trophicLevel.idealRatio};
  });

  if (hasExtinction) {
    return 0;
  }
  const normalizedScores = levelScores.map((curr, i) => {
    let currScore = 1;
    
    // Penalize based on deviation from next level
    if (i < levelScores.length - 1) {
      const nextTrophicLevel = levelScores[i + 1];
      const deviation = calculateRatioDeviation(curr.totalPop, nextTrophicLevel.totalPop, curr.ideal, nextTrophicLevel.ideal);
      currScore = deviationToScore(deviation, 0.2);
    }
    return currScore;
  });
  /**
   * Final ecosystem health.
   * Health is the average of all normalized trophic levels
   * Returned in range [0, 1]
   */
  const ecosystemHealth = normalizedScores.reduce((a, b) => a + b, 0) / normalizedScores.length;
  return ecosystemHealth;
}
