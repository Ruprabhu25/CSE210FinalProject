import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameTop from '../src/game/GameTop.jsx'

describe('GameTop health tooltip', () => {
  const baseProps = {
    currentSeason: 'Spring',
    roundNumber: 1,
    health: 55,
    darkMode: false,
    onDarkModeToggle: () => {},
    audioEnabled: true,
    onAudioToggle: () => {}
  }

  test('shows tooltip on hover and hides on leave', () => {
    const { container } = render(<GameTop {...baseProps} />)

    expect(
      screen.queryByText(/Factors Affecting Ecosystem Health/i)
    ).toBeNull()

    const healthContainer = container.querySelector('.healthContainer')
    fireEvent.mouseEnter(healthContainer)

    expect(
      screen.getByText(/Factors Affecting Ecosystem Health/i)
    ).toBeInTheDocument()

    fireEvent.mouseLeave(healthContainer)

    expect(
      screen.queryByText(/Factors Affecting Ecosystem Health/i)
    ).toBeNull()
  })

  test('toggles tooltip on click', () => {
    const { container } = render(<GameTop {...baseProps} />)

    const healthContainer = container.querySelector('.healthContainer')

    fireEvent.click(healthContainer)
    expect(
      screen.getByText(/Factors Affecting Ecosystem Health/i)
    ).toBeInTheDocument()

    fireEvent.click(healthContainer)
    expect(
      screen.queryByText(/Factors Affecting Ecosystem Health/i)
    ).toBeNull()
  })
})
