import System from "./System"
const MULTIPLIER_DIVISION_FACTOR = 2;

class FoodChainSystem extends System {
    constructor() {
        super("FoodChainSystem")
    }
    getTotalPopulation(names) {
        let total = 0
        for (const id of names) {
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
            const preyNames = Object.keys(preyLevel.speciesMap)
            const predatorNames = Object.keys(predatorLevel.speciesMap)
            // Total prey and predator available
            const totalPrey = this.getTotalPopulation(preyNames)
            const totalPredator = this.getTotalPopulation(predatorNames)
            if (totalPrey === 0 || totalPredator === 0) {
                continue
            }; 

            const actualRatio = totalPrey / totalPredator;
            const idealRatio = preyLevel.idealRatio / predatorLevel.idealRatio;
            const deviation = Math.abs(actualRatio - idealRatio) / idealRatio;
            if (deviation < 0.2) {
                continue;
            }

            // If prey are scarce relative to predators, predators decline and prey decline slightly due to overconsumption
            if (actualRatio < idealRatio) {
                for (const id of predatorNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + deviation * MULTIPLIER_DIVISION_FACTOR);
                    }
                }
                for (const id of preyNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + deviation * (MULTIPLIER_DIVISION_FACTOR));
                    }
                }
            } 
            else {
                // If prey are abundant, predators grow and prey decrease slightly
                for (const id of predatorNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByGrowthRate(deviation * MULTIPLIER_DIVISION_FACTOR);
                    }
                }
                for (const id of preyNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 - deviation);
                    }
                }
            }
        }
    }
}

export default FoodChainSystem