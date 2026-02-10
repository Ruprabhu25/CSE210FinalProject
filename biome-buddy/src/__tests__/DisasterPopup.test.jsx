import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// jest-dom matchers are loaded via vitest setup file

import DisasterPopup from '../DisasterPopup'
import { showDisaster, DISASTER_TEXTS } from '../disasterBus'

describe('DisasterPopup', () => {
    test('shows message when showDisaster is called with key', async () => {
        render(<DisasterPopup />)

        showDisaster('forest_fire')

        const title = await screen.findByText(/Natural Disaster has hit!/i)
        expect(title).toBeInTheDocument()

        const body = await screen.findByText(DISASTER_TEXTS['forest_fire'])
        expect(body).toBeInTheDocument()
    })

    test('closes when close button is clicked', async () => {
        render(<DisasterPopup />)
        showDisaster('flood')

        const close = await screen.findByRole('button', { name: /close/i })
        expect(close).toBeInTheDocument()

        const ue = userEvent.setup()
        await ue.click(close)

        await waitFor(() => {
            expect(screen.queryByText(/Natural Disaster has hit!/i)).not.toBeInTheDocument()
        })
    })
})
