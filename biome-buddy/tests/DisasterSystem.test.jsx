import { describe, it, expect, beforeEach, vi } from 'vitest'
import DisasterSystem from '../src/systems/DisasterSystem'
import gameLogSystem from '../src/systems/GameLogSystem'

function makeMockContext() {
    const populations = new Map()
    populations.set(1, { size: 100 })
    populations.set(2, { size: 50 })
    populations.set(3, { size: 20 })

    const trophicLevel = new Map()
    trophicLevel.set('producer', [1])
    trophicLevel.set('herbivore', [2])
    trophicLevel.set('primaryCarnivore', [3])

    return {
        roundNumber: 4, // will equal 4 rounds => a "year" if numRoundsInSeason==1
        numRoundsInSeason: 1,
        populations,
        trophicLevel,
        ecosystemHealth: 1,
        determineSeason: () => 'Summer',
        calculateEcosystemHealth: () => 0.75
    }
}

describe('DisasterSystem', () => {
    let ds

    beforeEach(() => {
        ds = new DisasterSystem()
        gameLogSystem.clear()
        // restore Math.random if previously mocked
        if (vi.isMockFunction(Math.random)) vi.spyOn(Math, 'random').mockRestore()
    })

    it('does not apply a disaster when random roll is >= 0.7', () => {
        const ctx = makeMockContext()
        // make Math.random return 0.9 for the roll so no disaster
        const rnd = vi.spyOn(Math, 'random').mockImplementation(() => 0.9)

        ds.apply(ctx)

        // populations should remain unchanged
        expect(ctx.populations.get(1).size).toBe(100)
        expect(ctx.populations.get(2).size).toBe(50)
        expect(ctx.populations.get(3).size).toBe(20)

        // no log entry created
        expect(gameLogSystem.getEntries().length).toBe(0)

        rnd.mockRestore()
    })

    it('applies a wildfire (when mocked) and logs event', () => {
        const ctx = makeMockContext()
        // Mock Math.random for two calls: first roll < 0.7, second selects first disaster key (index 0)
        const seq = [0.5, 0]
        let i = 0
        const rnd = vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length])

        const spy = vi.spyOn(gameLogSystem, 'addEntry')

        ds.apply(ctx)

        // wildfire impacts: producer 0.5, herbivore 0.2, primaryCarnivore 0.1
        expect(ctx.populations.get(1).size).toBe(50) // 100 -> 50
        expect(ctx.populations.get(2).size).toBe(40) // 50 -> 40
        expect(ctx.populations.get(3).size).toBe(18) // 20 -> 18

        // ecosystem health updated to number between 0 and 1
        expect(typeof ctx.ecosystemHealth).toBe('number')
        expect(ctx.ecosystemHealth).toBeGreaterThanOrEqual(0)
        expect(ctx.ecosystemHealth).toBeLessThanOrEqual(1)

        // ensure a log entry was added
        expect(spy).toHaveBeenCalledTimes(1)
        const callArg = spy.mock.calls[0][0]
        expect(callArg).toHaveProperty('season', 'Summer')
        expect(callArg).toHaveProperty('name')
        expect(callArg.name).toMatch(/Wildfire|Wildfire/i)

        rnd.mockRestore()
        spy.mockRestore()
    })
})
