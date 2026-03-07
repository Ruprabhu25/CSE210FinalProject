import System from "./System"
const GROWTH_RATE_MULTIPLIER = 2 
const TOP_PREDATOR_GUARANTEE = new Set(["Hawk", "Bear"])

class PlayerActionSystem extends System {
    constructor() {
        super("PlayerActionSystem")
        this.chosenSpeciesName = "" // This will be set by the UI when the player makes a choice
    }

    apply(context) {
        context.roundGrowthGuarantee = null

        if (this.chosenSpeciesName != "") {
            const population = context.populations.get(this.chosenSpeciesName)
            if (population == null) throw new Error(`Population with species name ${this.chosenSpeciesName} not found in GameContext populations.`)
            const sizeBeforeBoost = population.getCurrentSize()
            population.updatePopulationByGrowthRate(GROWTH_RATE_MULTIPLIER) 
            const sizeAfterBoost = population.getCurrentSize()
            const capacityLimit = population.carryingCapacity == null ? Infinity : population.carryingCapacity

            // Guarantee visible feedback for a player-selected species when growth rounding would add 0.
            const hasIndividuals = sizeBeforeBoost > 0
            const atCapacity = population.carryingCapacity != null && sizeAfterBoost >= population.carryingCapacity
            if (hasIndividuals && !atCapacity && sizeAfterBoost <= sizeBeforeBoost) {
                population.size = sizeBeforeBoost + 1
            }

            // Extra guarantee for top predators: ensure they are still at least +1
            // after FoodChainSystem runs in the same round.
            if (
                hasIndividuals &&
                TOP_PREDATOR_GUARANTEE.has(this.chosenSpeciesName) &&
                sizeBeforeBoost < 10
            ) {
                context.roundGrowthGuarantee = {
                    speciesName: this.chosenSpeciesName,
                    minSize: Math.min(capacityLimit, sizeBeforeBoost + 1)
                }
            }
        }
        this.chosenSpeciesName = "" // Reset the choice after applying the system
    }

    setChosenSpeciesName(speciesName) {
        this.chosenSpeciesName = speciesName
    }
}

export default PlayerActionSystem
