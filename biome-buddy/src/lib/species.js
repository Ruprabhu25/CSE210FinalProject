/**
 * Species base class and consumer/producer subclasses.
 * Simple model for population, biomass and energy bookkeeping.
 */

let _nextSpeciesId = 1

export class Species {
  /**
   * @param {string} name
   * @param {number} energy - energy per individual
   * @param {number} biomass - biomass per individual
   * @param {number} population
   * @param {number} growthRate - fractional growth per update (e.g. 0.1 = +10%)
   */
  constructor(name, energy, biomass) {
    this.name = String(name)
    this.energy = Number(energy) || 0
    this.biomass = Number(biomass) || 0
    // assign a unique numeric id to each species instance
    this.speciesid = _nextSpeciesId++
  }

  getTotalBiomass() {
    return this.biomass * this._population.getCurrentSize()
  }

  getTotalEnergy() {
    return this.energy * this._population.getCurrentSize()
  }

  toJSON() {
    return {
      name: this.name,
      energy: this.energy,
      biomass: this.biomass,
      population: this._population.getCurrentSize(),
      growthRate: this._population.baseGrowthRate,
      speciesid: this.speciesid,
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