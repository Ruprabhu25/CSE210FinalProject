import { describe, it, expect, beforeEach } from 'vitest'
import GameEngine from '../src/GameEngine'

// Integration tests that uses GameEngine and GameContext together as well as Populations, Species, TrophicLevels
describe('GameEngine Integration', () => {
  let engine

  beforeEach(() => {
    engine = new GameEngine() // new engine with a new context before each test
  })

  it('should increment round number and update season correctly for the full year and an additional round', () => {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter']
    for (let i = 0; i < engine.context.numRoundsInSeason * 4 + 1; i++) {
      engine.runRound()
      expect(engine.context.roundNumber).toBe(i + 2) // Round number should increment by 1 each round, starting from 1
      expect(engine.context.determineSeason()).toBe(seasons[Math.floor((engine.context.roundNumber - 1) / engine.context.numRoundsInSeason) % seasons.length])
    }
  })

  it('should update at least one population after a round', () => {
    const before = Array.from(engine.context.populations.values()).map(p => p.size)
    engine.runRound()
    const after = Array.from(engine.context.populations.values()).map(p => p.size)
    // At least one population should change
    expect(after.some((val, i) => val !== before[i])).toBe(true)
  })

  it('should calculate ecosystem health without error after a full year, populations should not become negative', () => {
    for (let i = 0; i < engine.context.numRoundsInSeason * 4; i++) {
      engine.runRound()
      // Should not throw error checking ecosystem health after each round in a full year
      expect(() => engine.context.calculateEcosystemHealth()).not.toThrow()
      // Also check that no population has become negative
      const negativePop = Array.from(engine.context.populations.values()).some(p => p.size < 0)
      expect(negativePop).toBe(false)
    }
  })
})
