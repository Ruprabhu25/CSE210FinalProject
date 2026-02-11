/**
 * Species base class and consumer/producer subclasses.
 * Simple model for population, biomass and energy bookkeeping.
 */
export class Species {
  /**
   * @param {string} name
   * @param {number} energy - energy per individual
   * @param {number} biomass - biomass per individual
   * @param {number} population
   * @param {number} growthRate - fractional growth per update (e.g. 0.1 = +10%)
   */
  constructor(name, energy, biomass, population = 0, growthRate = 0) {
    this.name = String(name)
    this.energy = Number(energy) || 0
    this.biomass = Number(biomass) || 0
    this.population = Number(population) || 0
    this.growthRate = Number(growthRate) || 0
  }

  // directly update growth rate
  setGrowthRate(newRate) {
    this.growthRate = Number(newRate) || 0
  }

  getTotalBiomass() {
    return this.biomass * this.population
  }

  getTotalEnergy() {
    return this.energy * this.population
  }

  /**
   * Update population according to growthRate.
   * Keeps population non-negative. Population may be fractional; caller
   * can round if integer counts are required.
   * @returns {number} new population
   */
  updatePopulation() {
    const next = this.population + this.population * this.growthRate
    this.population = Math.max(0, next)
    return this.population
  }

  toJSON() {
    return {
      name: this.name,
      energy: this.energy,
      biomass: this.biomass,
      population: this.population,
      growthRate: this.growthRate,
    }
  }
}

export class Producer extends Species {
  constructor(name, energy, biomass, population = 0, growthRate = 0.1) {
    super(name, energy, biomass, population, growthRate)
    this.trophic = 'producer'
  }
}

export class PrimaryConsumer extends Species {
  constructor(name, energy, biomass, population = 0, growthRate = 0.05) {
    super(name, energy, biomass, population, growthRate)
    this.trophic = 'primary-consumer'
  }
}

export class SecondaryConsumer extends Species {
  constructor(name, energy, biomass, population = 0, growthRate = 0.03) {
    super(name, energy, biomass, population, growthRate)
    this.trophic = 'secondary-consumer'
  }
}

export class TertiaryConsumer extends Species {
  constructor(name, energy, biomass, population = 0, growthRate = 0.01) {
    super(name, energy, biomass, population, growthRate)
    this.trophic = 'tertiary-consumer'
  }
}
