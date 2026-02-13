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

        const action = screen.getByRole('button', { name: /Build Safe Burrows/i })
        expect(action).toBeInTheDocument()

        action.click()

        expect(onAction).toHaveBeenCalledWith(disasters.flood.actions[0])
    })
})
