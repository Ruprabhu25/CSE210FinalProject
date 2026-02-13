export class Population {
    constructor(speciesName, size = 0, baseGrowthRate = 0, baseMortalityRate = 0) {
        this.speciesName = speciesName
        this.size = size
        this.baseGrowthRate = baseGrowthRate
        this.baseMortalityRate = baseMortalityRate
    }

    getCurrentSize() {
        return this.size
    }

    // This function applies the growth and mortality rates to the population size
    updatePopulationByGrowthRate(growthRateMultiplier = 1) {
        const growth = Math.round(this.size * this.baseGrowthRate * growthRateMultiplier)
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

export default Population