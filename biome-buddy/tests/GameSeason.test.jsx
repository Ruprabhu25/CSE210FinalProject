import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import gameLogSystem from '../src/systems/GameLogSystem'

describe('Game season and disaster behavior', () => {
    beforeEach(() => {
        // clear log and reset mocks
        gameLogSystem.clear()
        vi.restoreAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('advances season and logs event when no disaster occurs', async () => {
        // Make Math.random return > 0.4 so no disaster
        vi.spyOn(Math, 'random').mockImplementation(() => 0.9)

        // mock calculateEcosystemBalance to a stable value
        vi.resetModules()
        vi.mock('../src/ecosystemBalance', () => ({ calculateEcosystemBalance: () => 0.7 }))
        const { default: GameBlank } = await import('../src/Game.jsx')

        render(<GameBlank />)

        const nextBtn = screen.getByText(/Next Season/i)
        expect(nextBtn).toBeInTheDocument()

        fireEvent.click(nextBtn)

        // the game log should contain the season advance entry
        await waitFor(() => {
            expect(screen.getByText(/Advanced to next season/i)).toBeInTheDocument()
        })
    })

    it('generates a disaster, reduces health by 20 points, and shows popup', async () => {
        // Sequence of Math.random calls: first <0.4 to trigger disaster, second chooses disaster key (0 picks first key)
        const seq = [0.1, 0]
        let idx = 0
        vi.spyOn(Math, 'random').mockImplementation(() => seq[idx++ % seq.length])


        // mock calculateEcosystemBalance to a stable value 0.7
        vi.resetModules()
        vi.mock('../src/ecosystemBalance', () => ({ calculateEcosystemBalance: () => 0.7 }))
        const { default: GameBlank } = await import('../src/Game.jsx')
        render(<GameBlank />)

        // initial health should be displayed (70%)
        expect(screen.getByText(/EcoSystem Health: 70%/i)).toBeInTheDocument()

        const nextBtn = screen.getByText(/Next Season/i)
        fireEvent.click(nextBtn)

        // after a disaster, health should drop by 20 percentage points
        // TODO: this test is broken because the balance calculation can yield a value 
        // that results in less than 20 point drop, causing the test to fail. 
        // We should mock calculateEcosystemBalance to return a fixed value to ensure consistent test results.
        await waitFor(() => {
            expect(screen.getByText(/EcoSystem Health: 50%/i)).toBeInTheDocument()
        })

        // popup should be visible with a disaster title (first disaster is Wildfire)
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Wildfire/i })).toBeInTheDocument()
        })

        // log should contain disaster message
        await waitFor(() => {
            expect(screen.getByText(/Wildfire:/i)).toBeInTheDocument()
        })
    })
})
