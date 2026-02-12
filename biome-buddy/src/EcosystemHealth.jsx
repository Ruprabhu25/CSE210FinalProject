/**
 * Calculates ecosystem health based on species scores and trophic level ratios
 * Health is returned in the range [0, 1], makes it easier to treat health as normalized value
 */

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
 * @param {Object} context - GameContext instance with trophicLevels and populations
 * @returns {number} Ecosystem health
 */
export function calculateEcosystemBalance(context) {
  const trophicLevels = context.trophicLevels || [];
  const populations = context.populations || new Map();
  let hasExtinction = false;

  const levelScores = trophicLevels.map((trophicLevel) => {
    let totalScore = 0;
    const speciesMap = trophicLevel.speciesMap || {};
    
    Object.entries(speciesMap).forEach(([speciesId, speciesData]) => {
      const pop = populations.get(Number(speciesId));
      let size = 0;
      if (pop) {
        size = pop.getCurrentSize();
      } 
      if (size === 0) {
        hasExtinction = true;
        return;
      }
      // change once getter functions are added
      const biomass = speciesData.biomass;
      const energy = speciesData.energy;
      totalScore += calculateSpeciesScore(size, biomass, energy);
    });
    return {level: trophicLevel.name, score: totalScore, ideal: trophicLevel.idealRatio || 1};
  });
  const normalizedScores = levelScores.map((curr, i) => {
    let currScore = curr.score / curr.ideal;
    
    // Penalize based on deviation from next level
    if (i < levelScores.length - 1) {
      const next = levelScores[i + 1];
      const actualRatio = curr.score / (next.score); 
      const idealRatio = curr.ideal / next.ideal;
      const deviation = Math.abs(actualRatio - idealRatio) / idealRatio;
    
      // Allow 20% tolerance
      if (deviation < 0.2) {
        currScore = 1;
      }
      else{
        // Dynamic penalty: worse imbalance -> stronger punishment
        const levelPenalty = Math.max(0.1, 1 - deviation);
        currScore *= levelPenalty;
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
