import { describe, it, expect } from 'vitest'
import { getCategoryAndMessage } from '../src/data/consequenceMessages'

function makeContext(sizes, health) {
  const populations = new Map(
    Object.entries(sizes).map(([name, size]) => [name, { getCurrentSize: () => size }])
  )
  return { populations, calculateEcosystemHealth: () => health }
}

function makePrevSizes(sizes) {
  return new Map(Object.entries(sizes))
}

const BASE = { Grass: 1000, Rabbit: 250, Fox: 40, Hawk: 12 }

describe('getCategoryAndMessage', () => {

  it('returns extinction when a species drops from > 0 to 0', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Fox: 0 }, 0)
    const { category, message } = getCategoryAndMessage(prev, 0.6, ctx, null)
    expect(category).toBe('extinction')
    expect(message).toMatch(/vanished/)
  })

  it('does not return extinction when species was already 0 before the round', () => {
    const prev = makePrevSizes({ ...BASE, Hawk: 0 })
    const ctx = makeContext({ ...BASE, Hawk: 0 }, 0.6)
    const { category } = getCategoryAndMessage(prev, 0.6, ctx, null)
    expect(category).not.toBe('extinction')
  })

  it('returns critical_decline for > 30% population loss, naming the species', () => {
    // Fox drops from 40 to 27 = 32.5% loss
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Fox: 27 }, 0.55)
    const { category, message } = getCategoryAndMessage(prev, 0.6, ctx, null)
    expect(category).toBe('critical_decline')
    expect(message).toMatch(/Fox/)
    expect(message).toMatch(/plummeted/)
  })

  it('does not return critical_decline for exactly 30% loss (threshold is strictly >)', () => {
    // Grass drops from 1000 to 700 = exactly 30%
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Grass: 700 }, 0.6)
    const { category } = getCategoryAndMessage(prev, 0.6, ctx, null)
    expect(category).not.toBe('critical_decline')
  })

  it('returns health_declining when ecosystem health drops by more than 0.10', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext(BASE, 0.40) // was 0.55, diff = 0.15
    const { category, message } = getCategoryAndMessage(prev, 0.55, ctx, null)
    expect(category).toBe('health_declining')
    expect(message).toMatch(/struggles/)
  })

  it('returns health_improving when ecosystem health rises by more than 0.10', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext(BASE, 0.65) // was 0.50, diff = 0.15
    const { category, message } = getCategoryAndMessage(prev, 0.50, ctx, null)
    expect(category).toBe('health_improving')
    expect(message).toMatch(/breathes easier/)
  })

  it('returns boosted_thriving when selected species grew by more than 15%', () => {
    // Rabbit grows from 250 to 295 = 18%
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Rabbit: 295 }, 0.60)
    const { category, message } = getCategoryAndMessage(prev, 0.60, ctx, 'Rabbit')
    expect(category).toBe('boosted_thriving')
    expect(message).toMatch(/Rabbit/)
    expect(message).toMatch(/flourishing/)
  })

  it('does not return boosted_thriving when selected species grew less than 15%', () => {
    // Rabbit grows from 250 to 260 = 4%
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Rabbit: 260 }, 0.60)
    const { category } = getCategoryAndMessage(prev, 0.60, ctx, 'Rabbit')
    expect(category).toBe('stable')
  })

  it('returns stable as catch-all when nothing dramatic occurred', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ Grass: 1020, Rabbit: 255, Fox: 41, Hawk: 12 }, 0.61)
    const { category, message } = getCategoryAndMessage(prev, 0.60, ctx, null)
    expect(category).toBe('stable')
    expect(message).toMatch(/seasons turn/)
  })

  it('extinction takes priority over critical_decline', () => {
    // Fox goes from 40 to 0: both extinction and 100% loss
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Fox: 0 }, 0)
    const { category } = getCategoryAndMessage(prev, 0.6, ctx, null)
    expect(category).toBe('extinction')
  })

  it('critical_decline takes priority over health_declining', () => {
    // Grass drops 40% AND health dropped 0.15
    const prev = makePrevSizes(BASE)
    const ctx = makeContext({ ...BASE, Grass: 600 }, 0.40)
    const { category } = getCategoryAndMessage(prev, 0.55, ctx, null)
    expect(category).toBe('critical_decline')
  })

  it('returns stable when selectedSpeciesName is null and ecosystem is calm', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext(BASE, 0.60)
    const { category } = getCategoryAndMessage(prev, 0.60, ctx, null)
    expect(category).toBe('stable')
  })

  it('handles empty string selectedSpeciesName without crashing', () => {
    const prev = makePrevSizes(BASE)
    const ctx = makeContext(BASE, 0.60)
    const { category } = getCategoryAndMessage(prev, 0.60, ctx, '')
    expect(category).toBe('stable')
  })

})
