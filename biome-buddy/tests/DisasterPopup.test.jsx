import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
// jest-dom matchers are loaded via vitest setup file

import DisasterPopup from '../src/components/DisasterPopup/DisasterPopup'
import { disasters } from '../src/data/disasters'

describe('DisasterPopup', () => {
    test('shows message when disaster prop is provided', () => {
        const onAction = vi.fn()
        render(<DisasterPopup disaster={disasters.wildfire} onAction={onAction} />)

        const title = screen.getByRole('heading', { name: /Wildfire/i })
        expect(title).toBeInTheDocument()

        const body = screen.getByText(/Extreme heat and prolonged drought ignited a wildfire\./i)
        expect(body).toBeInTheDocument()
    })

    test('calls onAction when an action button is clicked', () => {
        const onAction = vi.fn()
        render(<DisasterPopup disaster={disasters.flood} onAction={onAction} />)

        const action = screen.getByRole('button', {
            name: new RegExp(`${disasters.flood.actions[0].label} \\(${disasters.flood.actions[0].deltaPopulation} ${disasters.flood.actions[0].target}\\)`, 'i')
        })
        expect(action).toBeInTheDocument()

        action.click()

        expect(onAction).toHaveBeenCalledWith(disasters.flood.actions[0])
    })

    test('shows the correct educational blurb for every disaster', () => {
        for (const disaster of Object.values(disasters)) {
            const view = render(<DisasterPopup disaster={disaster} onAction={vi.fn()} />)
            expect(screen.getByText(disaster.educationBlurb)).toBeInTheDocument()
            view.unmount()
        }
    })

    test('formats action button effects with signed population deltas', () => {
        render(<DisasterPopup disaster={disasters.flood} onAction={vi.fn()} />)

        expect(screen.getByRole('button', {
            name: new RegExp(`${disasters.flood.actions[0].label} \\(${disasters.flood.actions[0].deltaPopulation} ${disasters.flood.actions[0].target}\\)`, 'i')
        })).toBeInTheDocument()
        expect(screen.getByRole('button', {
            name: new RegExp(`${disasters.flood.actions[1].label} \\(${disasters.flood.actions[1].deltaPopulation} ${disasters.flood.actions[1].target}\\)`, 'i')
        })).toBeInTheDocument()
    })
})
