/**
 * Categorizes the most significant consequence of a round and returns
 * an appropriate nature-themed message to display in the game log.
 *
 * @param {Map<string, number>} prevSizes - Population sizes before the round
 * @param {number} prevHealth - Ecosystem health [0,1] before the round
 * @param {object} context - Live GameContext after runRound()
 * @param {string|null} selectedSpeciesName - Species the player boosted, or null
 * @returns {{ category: string, message: string }}
 */
export function getCategoryAndMessage(prevSizes, prevHealth, context, selectedSpeciesName) {
  const currentHealth = context.calculateEcosystemHealth()

  // 1. Critical decline — any species lost more than 30% in one round
  for (const [name, prevSize] of prevSizes) {
    const curr = context.populations.get(name)?.getCurrentSize() ?? 0
    if (prevSize > 0 && (prevSize - curr) / prevSize > 0.30) {
      const msg = currentHealth < 0.3
        ? `${name} numbers have plummeted in a fragile ecosystem. Select them next round to give them a chance to recover.`
        : `${name} numbers have plummeted. Select ${name} next round to boost their recovery, or support their prey to ease the pressure.`
      return { category: 'critical_decline', message: msg }
    }
  }

  // 2. Ecosystem health dropped significantly
  if (prevHealth - currentHealth > 0.10) {
    const msg = currentHealth < 0.25
      ? `The ecosystem is in crisis — the forest struggles to survive. Boost Grass first to stabilize the base of the food web.`
      : `The forest struggles to maintain balance. Select the trophic level that looks weakest to help restore predator-prey dynamics.`
    return { category: 'health_declining', message: msg }
  }

  // 3. Ecosystem health improved significantly
  if (currentHealth - prevHealth > 0.10) {
    const msg = currentHealth > 0.75
      ? `The forest breathes easier — your efforts are paying off. Stay alert; a single disaster can still disrupt this recovery.`
      : `The forest breathes easier. Keep selecting the most stressed species each round to sustain this momentum.`
    return { category: 'health_improving', message: msg }
  }

  // 4. Player-boosted species is visibly thriving (grew > 15%)
  if (selectedSpeciesName) {
    const prev = prevSizes.get(selectedSpeciesName) ?? 0
    const curr = context.populations.get(selectedSpeciesName)?.getCurrentSize() ?? 0
    if (prev > 0 && (curr - prev) / prev > 0.15) {
      const msg = currentHealth > 0.7
        ? `The ${selectedSpeciesName} are flourishing, lifting the whole ecosystem with them. Watch for overpopulation as numbers grow.`
        : `The ${selectedSpeciesName} are flourishing under your care. Watch for ripple effects — their growth shifts pressure on species above and below.`
      return { category: 'boosted_thriving', message: msg }
    }
  }

  // 5. Nothing dramatic — stable round, tone and advice vary by health level
  if (currentHealth > 0.75)
    return { category: 'stable', message: `The forest thrives in balance. Keep an eye on species counts — a quiet round is the ideal time to get ahead of any imbalance.` }
  if (currentHealth < 0.4)
    return { category: 'stable', message: `The ecosystem is fragile. Select a producer like Grass to start rebuilding the base of the food web before populations spiral further.` }
  return { category: 'stable', message: `The seasons turn. Choose a species to support now — small, steady interventions prevent larger crises later.` }
}
