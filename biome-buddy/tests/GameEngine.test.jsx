import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameEngine from '../src/GameEngine'

// Mock the system classes and GameContext
class MockSystem {
  constructor() { this.apply = vi.fn() }
}
class MockContext {
  constructor() { this.increaseRound = vi.fn() }
}

describe('GameEngine', () => {
  let engine
  let systems
  let context

  beforeEach(() => {
    systems = [new MockSystem(), new MockSystem(), new MockSystem(), new MockSystem()]
    context = new MockContext()
    // Patch GameEngine to use mocks
    engine = new GameEngine()
    engine.systems = systems
    engine.context = context
  })

  it('should call apply on all systems in order', () => {
    // Track call order
    const callOrder = []
    systems.forEach((system, idx) => {
      system.apply = vi.fn(() => callOrder.push(idx))
    })
    engine.runRound()
    expect(callOrder).toEqual([0, 1, 2, 3])
    systems.forEach(system => {
      expect(system.apply).toHaveBeenCalledWith(context)
    })
  })

  it('should call increaseRound on context after running systems', () => {
    engine.runRound()
    expect(context.increaseRound).toHaveBeenCalled()
  })

  it('should return the context after running a round', () => {
    const result = engine.runRound()
    expect(result).toBe(context)
  })
})
