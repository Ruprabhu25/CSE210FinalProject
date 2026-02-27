import { describe, it, expect, beforeEach } from 'vitest'
import GameEngine from '../src/GameEngine'

import { disasters } from '../src/data/disasters'

// Integration tests between GameEngine, GameContext, and Systems objects as well as Populations, Species, TrophicLevels
describe('GameEngine System Integration', () => {
  let engine

  beforeEach(() => {
    engine = new GameEngine()
  })

  it('should allow a player action to affect a population (compared to no action)', () => {
    // Find PlayerActionSystem
    const playerSystem = engine.systems.find(s => s.name === 'PlayerActionSystem')
    // Pick a valid species ID from context
    const speciesName = Array.from(engine.context.populations.keys())[0]

    // Clone the engine/context as a control group (no action)
    const engineNoAction = new GameEngine()
    // Sync initial state
    engineNoAction.context.roundNumber = engine.context.roundNumber
    engineNoAction.context.populations.forEach((pop, name) => {
      pop.size = engine.context.populations.get(name).size
    })

    // With player action
    playerSystem.setChosenSpeciesName(speciesName)
    engine.runRound()
    // Without player action
    engineNoAction.runRound()

    const withAction = engine.context.populations.get(speciesName).size
    const noAction = engineNoAction.context.populations.get(speciesName).size
    expect(withAction).not.toBeCloseTo(noAction)
  })

  it('SeasonSystem should affect producer population differently in different seasons', () => {
    // Get a producer species ID
    const producerId = Array.from(engine.context.populations.keys())[0]
    const pop = engine.context.populations.get(producerId)
    // Set to Spring
    engine.context.roundNumber = 1
    const beforeSpring = pop.size = 100
    engine.runRound()
    const afterSpring = pop.size
    // Set to Winter
    engine.context.roundNumber = engine.context.numRoundsInSeason * 3 + 1 // should be winter
    if (engine.context.determineSeason() !== 'Winter') {
      throw new Error('Season is not Winter as expected');
    }
    pop.size = 100
    engine.runRound()
    const afterWinter = pop.size
    // Expect different results due to growth/mortality modifiers
    expect(afterSpring).not.toBeCloseTo(afterWinter)
  })

  it('FoodChainSystem should affect populations across trophic levels (compared to no FoodChainSystem)', () => {
    // Remove FoodChainSystem from one engine
    const engineNoFoodChain = new GameEngine()
    // Remove FoodChainSystem from systems array
    engineNoFoodChain.systems = engineNoFoodChain.systems.filter(s => s.name !== 'FoodChainSystem')
    // Sync initial state
    engineNoFoodChain.context.roundNumber = engine.context.roundNumber
    engineNoFoodChain.context.populations.forEach((pop, name) => {
      pop.size = engine.context.populations.get(name).size
    })

    // Run a round in both engines
    engine.runRound()
    engineNoFoodChain.runRound()

    // Compare populations
    const ids = Array.from(engine.context.populations.keys())
    const withFoodChain = ids.map(id => engine.context.populations.get(id).size)
    const noFoodChain = ids.map(id => engineNoFoodChain.context.populations.get(id).size)
    // At least one population should differ if FoodChainSystem has an effect
    expect(withFoodChain.some((val, i) => val !== noFoodChain[i])).toBe(true)
  })

  it('DisasterSystem should be able to set a disaster and affect populations', () => {
    // Simulate a disaster by enabling popup disasters and running a round
    engine.context.enablePopupDisasters = true
    engine.context.currentDisaster = true;
    engine.context.pendingDisasterAction = disasters['wildfire'].actions[0];
    // Remove DisasterSystem from one engine
    const engineNoDisaster = new GameEngine()
    // Remove DisasterSystem from systems array
    engineNoDisaster.systems = engineNoDisaster.systems.filter(s => s.name !== 'DisasterSystem')
    // Sync initial state
    engineNoDisaster.context.roundNumber = engine.context.roundNumber
    engineNoDisaster.context.populations.forEach((pop, name) => {
      pop.size = engine.context.populations.get(name).size
    })

    // Run a round in both engines
    engine.runRound()
    engineNoDisaster.runRound()

    // Compare populations
    const ids = Array.from(engine.context.populations.keys())
    const withDisaster = ids.map(id => engine.context.populations.get(id).size)
    const noDisaster = ids.map(id => engineNoDisaster.context.populations.get(id).size)
    // At least one population should differ if DisasterSystem has an effect
    expect(withDisaster.some((val, i) => val !== noDisaster[i])).toBe(true)
  })
})
