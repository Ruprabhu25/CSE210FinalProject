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
   */
  constructor(name, energy, biomass) {
    this.name = String(name)
    this.energy = Number(energy) || 0
    this.biomass = Number(biomass) || 0
    // assign a unique numeric id to each species instance
    this.speciesid = _nextSpeciesId++
  }
}

