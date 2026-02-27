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

            // Cap effect strength to prevent wild overcorrection on large deviations
            const effectStrength = Math.min(deviation, 1.5);

            // If prey are scarce relative to predators, predators starve.
            // Prey are left alone so they can recover as predator numbers fall.
            if (actualRatio < idealRatio) {
                for (const id of predatorNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + effectStrength * MULTIPLIER_DIVISION_FACTOR);
                    }
                }
            }
            else {
                // If prey are abundant, predators thrive and consume more prey.
                for (const id of predatorNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByGrowthRate(1 + effectStrength * MULTIPLIER_DIVISION_FACTOR);
                    }
                }
                for (const id of preyNames) {
                    const pop = this.populations.get(id);
                    if (pop) {
                        pop.updatePopulationByMortalityRate(1 + effectStrength);
                    }
                }
            }
        }
    }
}

export default FoodChainSystem