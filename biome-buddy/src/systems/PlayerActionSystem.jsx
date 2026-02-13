import System from "./System"

const GROWTH_RATE_MULTIPLIER = 2 

class PlayerActionSystem extends System {
    constructor() {
        super("PlayerActionSystem")
        this.speciesIDChoice = null // int - the species ID that the player chooses to take action on.
    }

    apply(context) {
        if (this.speciesIDChoice == null) throw new Error("PlayerActionSystem requires a speciesIDChoice to be set before applying the system.")
        const population = context.populations.get(this.speciesIDChoice)
        if (population == null) throw new Error(`Population with species ID ${this.speciesIDChoice} not found in GameContext populations.`)
        population.applyGrowthRateMultiplier(GROWTH_RATE_MULTIPLIER) 
        this.speciesIDChoice = null // Reset the choice after applying the system
    }

    setSpeciesIDChoice(speciesID) {
        this.speciesIDChoice = speciesID
    }
}

export default PlayerActionSystem