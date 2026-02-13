import System from "./System"
const GROWTH_RATE_MULTIPLIER = 2 

class PlayerActionSystem extends System {
    constructor() {
        super("PlayerActionSystem")
        this.chosenSpeciesName = "" // This will be set by the UI when the player makes a choice
    }

    apply(context) {
        if (this.chosenSpeciesName != "") {
            const population = context.populations.get(this.chosenSpeciesName)
            if (population == null) throw new Error(`Population with species name ${this.chosenSpeciesName} not found in GameContext populations.`)
            population.updatePopulationByGrowthRate(GROWTH_RATE_MULTIPLIER) 
        }
        this.chosenSpeciesName = "" // Reset the choice after applying the system
    }

    setChosenSpeciesName(speciesName) {
        this.chosenSpeciesName = speciesName
    }
}

export default PlayerActionSystem