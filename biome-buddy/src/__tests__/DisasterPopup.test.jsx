import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
// jest-dom matchers are loaded via vitest setup file

import DisasterPopup from '../components/DisasterPopup/DisasterPopup'
import { disasters } from '../data/disasters'

describe('DisasterPopup', () => {
    test('shows message when disaster prop is provided', () => {
        const onClose = vi.fn()
        render(<DisasterPopup disaster={disasters.wildfire} onClose={onClose} />)

        const title = screen.getByRole('heading', { name: /Wildfire/i })
        expect(title).toBeInTheDocument()

        const body = screen.getByText(/Extreme heat and prolonged drought ignited a wildfire\./i)
        expect(body).toBeInTheDocument()
    })

    test('closes when close button is clicked', () => {
        const onClose = vi.fn()
        render(<DisasterPopup disaster={disasters.flood} onClose={onClose} />)

        const close = screen.getByText('\u2715')
        expect(close).toBeInTheDocument()

        close.click()

        expect(onClose).toHaveBeenCalled()
    })
})
