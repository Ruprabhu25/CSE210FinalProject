/**
 * Species base class and consumer/producer subclasses.
 * Simple model for biomass and energy bookkeeping.
 */

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
  }
}

