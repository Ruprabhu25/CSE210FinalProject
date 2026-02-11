import { describe, it, expect, beforeEach } from 'vitest'
import GameContext from '../src/GameContext'

// Mock Population for testing
class MockPopulation {
  constructor(speciesId) {
    this.speciesId = speciesId
  }
}

describe('GameContext', () => {
  let context

  beforeEach(() => {
    context = new GameContext()
    // Replace Population instances with mocks for easier testing
    for (const [speciesId] of context.populations) {
      context.populations.set(speciesId, new MockPopulation(speciesId))
    }
  })

  it('should initialize roundNumber to 1', () => {
    expect(context.roundNumber).toBe(1)
  })

  // CAUTION: if pulling species ID from something other than hardcoded values, update this test to reflect that
  it('should initialize populations with correct species IDs', () => {
    expect(Array.from(context.populations.keys())).toEqual([1, 2, 3])
  })

  it('should initialize numRoundsInSeason to a positive integer', () => {
    expect(Number.isInteger(context.numRoundsInSeason)).toBe(true)
    expect(context.numRoundsInSeason).toBeGreaterThan(0)
  })

  it('should determine the correct season based on roundNumber', () => {
    context.roundNumber = 1 * context.numRoundsInSeason
    expect(context.determineSeason()).toBe('Spring')
    context.roundNumber = 2 * context.numRoundsInSeason
    expect(context.determineSeason()).toBe('Summer')
    context.roundNumber = 3 * context.numRoundsInSeason
    expect(context.determineSeason()).toBe('Fall')
    context.roundNumber = 4 * context.numRoundsInSeason
    expect(context.determineSeason()).toBe('Winter')
    context.roundNumber = 5 * context.numRoundsInSeason
    expect(context.determineSeason()).toBe('Spring')
  })

  it('should increase roundNumber when increaseRound is called', () => {
    const currentRound = context.roundNumber
    context.increaseRound()
    expect(context.roundNumber).toBe(currentRound + 1)
  })
})
