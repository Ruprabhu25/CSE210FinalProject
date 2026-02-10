import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Home biome flow', () => {
  test('Clicking Forest opens modal', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    const user = userEvent.setup()

    // find forest button by class
    const forestButton = document.querySelector('.forest-button')
    expect(forestButton).not.toBeNull()

    await user.click(forestButton)

    // modal should appear
    expect(
      screen.getByText(/You chose the Forest Biome/i)
    ).toBeInTheDocument()
  })
})
