import { describe, it, expect, beforeEach } from 'vitest'
import Population from '../src/Population'

describe('Population', () => {
  let pop

  beforeEach(() => {
    pop = new Population(1, 100, 0.1, 0.05) // reinitialize before each test to ensure tests are independent
  })

  it('should initialize with correct values', () => {
    expect(pop.speciesId).toBe(1)
    expect(pop.size).toBe(100)
    expect(pop.baseGrowthRate).toBe(0.1)
    expect(pop.baseMortalityRate).toBe(0.05)
  })

  it('should return current size', () => {
    expect(pop.getCurrentSize()).toBe(100)
  })

  it('should update population by growth rate', () => {
    pop.updatePopulationByGrowthRate()
    expect(pop.size).toBeCloseTo(110)
  })

  it('should update population by growth rate with multiplier', () => {
    pop.updatePopulationByGrowthRate(2)
    expect(pop.size).toBeCloseTo(120)
  })

  it('should update population by mortality rate', () => {
    pop.updatePopulationByMortalityRate()
    expect(pop.size).toBeCloseTo(95)
  })

  it('should update population by mortality rate with multiplier', () => {
    pop.updatePopulationByMortalityRate(2)
    expect(pop.size).toBeCloseTo(90)
  })
})
