class Population {
    constructor(speciesId, size = 0, baseGrowthRate = 0, baseMortalityRate = 0) {
        this.speciesId = speciesId
        this.size = size
        this.baseGrowthRate = baseGrowthRate
        this.baseMortalityRate = baseMortalityRate
    }

    getCurrentSize() {
        return this.size
    }

     // This function applies the growth and mortality rates to the population size
     updatePopulationByGrowthRate(growthRateMultiplier = 1) {
        const growth = this.size * this.baseGrowthRate * growthRateMultiplier
        this.size += growth
     }

     updatePopulationByMortalityRate(mortalityRateMultiplier = 1) {
        const mortality = this.size * this.baseMortalityRate * mortalityRateMultiplier
        this.size -= mortality
     }  
}

export default Population