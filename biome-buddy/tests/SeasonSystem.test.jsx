import { describe, it, expect, beforeEach, vi } from 'vitest'
import SeasonSystem from '../src/systems/SeasonSystem'

// Mock Population
class MockPopulation {
  constructor() {
    this.updatePopulationByGrowthRate = vi.fn()
    this.updatePopulationByMortalityRate = vi.fn()
  }
}

describe('SeasonSystem', () => {
  let system
  let context
  let population
  let springGrowthModifier = 1.5
  let springMortalityModifier = 0.5

  beforeEach(() => {
    system = new SeasonSystem()
    population = new MockPopulation()
    system.producerGrowthModifiers = {"spring": springGrowthModifier}
    system.producerMortalityModifiers = {"spring": springMortalityModifier}
    context = {
      determineSeason: vi.fn(() => 'spring'),
      trophicLevels: [ { populationMap: { 'Grass': {} } } ],
      populations: new Map([['Grass', population]])
    }
  })

  it('should apply correct growth and mortality modifiers for the current season', () => {
    system.apply(context)
    expect(population.updatePopulationByGrowthRate).toHaveBeenCalledWith(springGrowthModifier)
    expect(population.updatePopulationByMortalityRate).toHaveBeenCalledWith(springMortalityModifier)
  })

  it('should default to 1.0 if season is not recognized', () => {
    context.determineSeason = vi.fn(() => 'UnknownSeason')
    system.apply(context)
    expect(population.updatePopulationByGrowthRate).toHaveBeenCalledWith(1.0)
    expect(population.updatePopulationByMortalityRate).toHaveBeenCalledWith(1.0)
  })

  it('should throw an error if population is missing', () => {
    context.populations = new Map() // No population for 'Grass'
    expect(() => system.apply(context)).toThrowError('Producer Grass not found in GameContext populations.');
  })
})
