import { describe, it, expect, beforeEach, vi } from 'vitest'
import gameLogSystem from '../systems/GameLogSystem'

describe('GameLogSystem', () => {
    beforeEach(() => {
        gameLogSystem.clear()
    })

    it('addEntry stores and returns an entry', () => {
        const entry = gameLogSystem.addEntry({ season: 'Spring', message: 'Test event', name: 'Test' })
        const entries = gameLogSystem.getEntries()
        expect(entries.length).toBe(1)
        expect(entries[0].id).toBe(entry.id)
        expect(entries[0].message).toBe('Test event')
    })

    it('subscribe receives initial snapshot and updates', () => {
        const listener = vi.fn()
        const unsubscribe = gameLogSystem.subscribe(listener)
        // initial snapshot call
        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith([])

        const entry = gameLogSystem.addEntry({ season: 'Fall', message: 'Another', name: 'Evt' })
        expect(listener).toHaveBeenCalledTimes(2)
        const lastCallArg = listener.mock.calls[1][0]
        expect(Array.isArray(lastCallArg)).toBe(true)
        expect(lastCallArg[0].id).toBe(entry.id)

        unsubscribe()
        gameLogSystem.addEntry({ season: 'Winter', message: 'Post-unsub', name: 'Evt2' })
        // listener should not be called after unsubscribe
        expect(listener).toHaveBeenCalledTimes(2)
    })

    it('clear empties entries and notifies subscribers', () => {
        gameLogSystem.addEntry({ season: 'X', message: 'm', name: 'n' })
        const listener = vi.fn()
        gameLogSystem.subscribe(listener)
        expect(listener).toHaveBeenCalledTimes(1)

        gameLogSystem.clear()
        expect(gameLogSystem.getEntries().length).toBe(0)
        // listener called again with empty array
        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener.mock.calls[1][0]).toEqual([])
    })
})
