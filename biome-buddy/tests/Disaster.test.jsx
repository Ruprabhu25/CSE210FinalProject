import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi, afterEach } from 'vitest'
import GameBlank from '../src/Game.jsx'
import { disasters } from '../src/data/disasters'
import gameLogSystem from '../src/systems/GameLogSystem'
import DisasterPopup from '../src/components/disasterpopup/DisasterPopup'

function mockRandomSequence(values) {
  const randomSpy = vi.spyOn(Math, 'random')
  values.forEach((v) => randomSpy.mockReturnValueOnce(v))
  return randomSpy
}

function getSpeciesPopulation(name) {
  const speciesName = screen.getByText(name)
  const row = speciesName.closest('.itemStyle')
  return Number(row?.querySelector('.speciesPop')?.textContent)
}

describe('Disaster actions in Game', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('applies deltaPopulation to the target species when a disaster action is chosen', () => {
    vi.spyOn(gameLogSystem, 'addEntry').mockImplementation(() => {})
    render(<GameBlank />)

    expect(getSpeciesPopulation('Rabbit')).toBe(200)

    // First random => trigger disaster, second random => select "flood".
    mockRandomSequence([0.1, 0.5])
    fireEvent.click(screen.getByRole('button', { name: /^Next Season$/i }))

    fireEvent.click(screen.getByRole('button', { name: /Build Safe Burrows/i }))

    expect(getSpeciesPopulation('Rabbit')).toBe(245)
  })

  test('clamps species population to zero when a disaster action would make it negative', () => {
    vi.spyOn(gameLogSystem, 'addEntry').mockImplementation(() => {})
    render(<GameBlank />)

    expect(getSpeciesPopulation('Grass')).toBe(1000)

    const originalDelta = disasters.flood.actions[1].deltaPopulation
    disasters.flood.actions[1].deltaPopulation = -2000

    try {
      // First random => trigger disaster, second random => select "flood".
      mockRandomSequence([0.1, 0.5])
      fireEvent.click(screen.getByRole('button', { name: /^Next Season$/i }))

      fireEvent.click(screen.getByRole('button', { name: /Divert Flooding/i }))

      expect(getSpeciesPopulation('Grass')).toBe(0)
    } finally {
      disasters.flood.actions[1].deltaPopulation = originalDelta
    }
  })

  test('clicking an action in the disaster popup updates the visible target population in the UI', () => {
    vi.spyOn(gameLogSystem, 'addEntry').mockImplementation(() => {})
    render(<GameBlank />)

    expect(getSpeciesPopulation('Hawk')).toBe(5)

    // First random => trigger disaster, second random => select "drought".
    mockRandomSequence([0.1, 0.7])
    fireEvent.click(screen.getByRole('button', { name: /^Next Season$/i }))

    const actionButton = screen.getByRole('button', { name: /Conserve Water/i })
    expect(actionButton).toBeInTheDocument()

    fireEvent.click(actionButton)

    expect(getSpeciesPopulation('Fox')).toBe(24)
  })
})

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
