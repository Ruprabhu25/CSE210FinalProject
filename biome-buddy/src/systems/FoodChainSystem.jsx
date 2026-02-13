import System from "./System"

class FoodChainSystem extends System {
    constructor() {
        super("FoodChainSystem")
    }

    getTotalPopulation(speciesIds) {
        let total = 0
        for (const id of speciesIds) {
            const pop = this.populations.get(Number(id))
            if (pop) {
                total += pop.getCurrentSize()
            }
        }
        return total
    }

    apply(context) {
        this.trophicLevels = context.trophicLevels
        this.populations = context.populations

        for (let i = 0; i < this.trophicLevels.length - 1; i++) {
            const preyLevel = this.trophicLevels[i]
            const predatorLevel = this.trophicLevels[i + 1]

            const preySpeciesIds = Object.keys(preyLevel.speciesMap)
            const predatorSpeciesIds = Object.keys(predatorLevel.speciesMap)

            // Total prey and predator available
            const totalPrey = this.getTotalPopulation(preySpeciesIds)
            const totalPredator = this.getTotalPopulation(predatorSpeciesIds)

            if (totalPrey === 0 || totalPredator === 0) continue

            const actualRatio = totalPrey / totalPredator
            const idealRatio = (preyLevel.idealRatio || 1) / (predatorLevel.idealRatio || 1)
            const deviation = Math.abs(actualRatio - idealRatio) / idealRatio

            // Allow 20% tolerance
            if (deviation < 0.2) continue

            // If prey are scarce relative to predators, predators decline and prey recover
            if (actualRatio < idealRatio) {
                for (const id of predatorSpeciesIds) {
                    const pop = this.populations.get(Number(id))
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + deviation)
                    }
                }
                for (const id of preySpeciesIds) {
                    const pop = this.populations.get(Number(id))
                    if (pop) {
                        pop.updatePopulationByGrowthRate(1 + deviation / 2)
                    }
                }
            } else {
                // If prey are abundant, predators grow and prey face slightly higher mortality
                for (const id of predatorSpeciesIds) {
                    const pop = this.populations.get(Number(id))
                    if (pop) {
                        pop.updatePopulationByGrowthRate(1 + deviation)
                    }
                }
                for (const id of preySpeciesIds) {
                    const pop = this.populations.get(Number(id))
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + deviation / 4)
                    }
                }
            }
        }
    }
}

export default FoodChainSystem