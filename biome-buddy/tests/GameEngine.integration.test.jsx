import { describe, it, expect, beforeEach } from 'vitest'
import GameEngine from '../src/GameEngine'

// Integration tests that uses GameEngine and GameContext together as well as Populations, Species, TrophicLevels
describe('GameEngine Integration', () => {
  let engine

  beforeEach(() => {
    engine = new GameEngine() // new engine with a new context before each test
  })

  it('should increment round number and update season after a round', () => {
    const initialRound = engine.context.roundNumber
    const initialSeason = engine.context.determineSeason()
    engine.runRound()
    expect(engine.context.roundNumber).toBe(initialRound + 1)
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter']
    const initialIdx = seasons.indexOf(initialSeason)
    const nextIdx = (initialIdx + 1) % seasons.length
    const newSeason = engine.context.determineSeason()
    // After a round, season should be either the same or the next in order
    expect([initialSeason, seasons[nextIdx]]).toContain(newSeason)
  })

  it('should update at least one population after a round', () => {
    const before = Array.from(engine.context.populations.values()).map(p => p.size)
    engine.runRound()
    const after = Array.from(engine.context.populations.values()).map(p => p.size)
    // At least one population should change
    expect(after.some((val, i) => val !== before[i])).toBe(true)
  })

  it('should calculate ecosystem health without error after several rounds', () => {
    for (let i = 0; i < 5; i++) engine.runRound()
    expect(() => engine.context.calculateEcosystemHealth()).not.toThrow()
  })
})
