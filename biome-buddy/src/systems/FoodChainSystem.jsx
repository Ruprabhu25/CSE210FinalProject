import System from "./System"
import {calculateRatioDeviation, deviationToScore } from '../helperFunctions/healthCalculateHelperFunctions'

const MULTIPLIER_DIVISION_FACTOR = 4;
class FoodChainSystem extends System {
    constructor() {
        super("FoodChainSystem")
    }

    getTotalPopulation(speciesIds) {
        let total = 0
        for (const id of speciesIds) {
            const pop = this.populations.get(id)
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

            if (totalPrey === 0 || totalPredator === 0) {
                continue
            }; 
            const actualRatio = totalPrey / totalPredator
            const idealRatio = preyLevel.idealRatio / predatorLevel.idealRatio
            const deviation = calculateRatioDeviation(totalPrey, totalPredator, preyLevel.idealRatio, predatorLevel.idealRatio,)

            // Allow 20% tolerance
            const multiplier = deviationToScore(deviation, 0.2)
            if (multiplier === 1) {
                continue
            }; 

            // If prey are scarce relative to predators, predators decline and prey decline slightly due to overconsumption
            if (actualRatio < idealRatio) {
                for (const id of predatorSpeciesIds) {
                    const pop = this.populations.get(id)
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + (1-multiplier)*MULTIPLIER_DIVISION_FACTOR)
                    }
                }
                for (const id of preySpeciesIds) {
                    const pop = this.populations.get(id)
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + (1-multiplier)*MULTIPLIER_DIVISION_FACTOR)
                    }
                }
            } 
            else {
                // If prey are abundant, predators grow and prey decrease slightly
                for (const id of predatorSpeciesIds) {
                    const pop = this.populations.get(id)
                    if (pop) {
                        pop.updatePopulationByGrowthRate(1 + deviation*MULTIPLIER_DIVISION_FACTOR)
                    }
                }
                for (const id of preySpeciesIds) {
                    const pop = this.populations.get(id)
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 - Math.max(0, multiplier/MULTIPLIER_DIVISION_FACTOR))
                    }
                }
            }
        }
    }
}

export default FoodChainSystem