export class Population {
    constructor(speciesName, size = 0, baseGrowthRate = 0, baseMortalityRate = 0, carryingCapacity = null) {
        this.speciesName = speciesName
        this.size = size
        this.baseGrowthRate = baseGrowthRate
        this.baseMortalityRate = baseMortalityRate
        this.carryingCapacity = carryingCapacity
    }

    getCurrentSize() {
        return this.size
    }

    // This function applies the growth and mortality rates to the population size.
    // Uses logistic growth: as population approaches carrying capacity, growth slows naturally.
    updatePopulationByGrowthRate(growthRateMultiplier = 1) {
        const capacityFactor = this.carryingCapacity
            ? Math.max(0, 1 - this.size / this.carryingCapacity)
            : 1
        const growth = Math.round(this.size * this.baseGrowthRate * growthRateMultiplier * capacityFactor)
        this.size += growth
    }

    updatePopulationByMortalityRate(mortalityRateMultiplier = 1) {
        const mortality = Math.round(this.size * this.baseMortalityRate * mortalityRateMultiplier)
        this.size -= mortality;
        if (this.size < 0){
            this.size = 0
        }
    }
}