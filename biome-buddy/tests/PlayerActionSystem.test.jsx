import { describe, it, expect, beforeEach, vi } from 'vitest'
import PlayerActionSystem from '../src/systems/PlayerActionSystem'

// Mock Population
class MockPopulation {
  constructor() {
    this.applyGrowthRateMultiplier = vi.fn()
  }
}

describe('PlayerActionSystem', () => {
  let system
  let context
  let population

  beforeEach(() => {
    system = new PlayerActionSystem()
    population = new MockPopulation()
    context = { populations: new Map([["test", population]]) }
  })

  it('should throw if population for chosenSpeciesName does not exist', () => {
    system.setChosenSpeciesName("UnknownSpecies")
    expect(() => system.apply(context)).toThrow('Population with species name UnknownSpecies not found in GameContext populations.')
  })

  it('should call applyGrowthRateMultiplier on the chosen population', () => {
    system.setChosenSpeciesName("test")
    system.apply(context)
    expect(population.applyGrowthRateMultiplier).toHaveBeenCalled()
    expect(system.chosenSpeciesName).toBe("")
  })
})
