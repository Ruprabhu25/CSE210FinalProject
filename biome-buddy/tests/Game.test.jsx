import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GameBlank from '../src/game/Game'
import { Species } from '../src/Species'
import gameLogSystem from '../src/systems/GameLogSystem'

describe('GameBlank Component', () => {

  beforeEach(() => {
    // Clear the game log before each test to prevent duplicates
    gameLogSystem.clear()
  })

  test('renders top HUD and initial species', () => {
    render(<GameBlank />)

    // Check ecosystem health
    expect(screen.getByText(/EcoSystem Health/i)).toBeInTheDocument()

    // Check initial season - now appears in both badge and game log
    const seasonElements = screen.getAllByText(/Season 1/i)
    expect(seasonElements.length).toBeGreaterThanOrEqual(1)

    // Check species names
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Rabbit')).toBeInTheDocument()
    expect(screen.getByText('Fox')).toBeInTheDocument()
    expect(screen.getByText('Hawk')).toBeInTheDocument()
  })

  test('selecting a species updates selection', () => {
    render(<GameBlank />)

    const rabbit = screen.getByText('Rabbit')
    fireEvent.click(rabbit)

    // The parent div should have "selected" class
    expect(rabbit.closest('.itemStyle')).toHaveClass('selected')
  })


  test('addSpecies function introduces new species and notification', () => {
    render(<GameBlank />)

    // Click next season until new species added (Berry Bush at season 3)
    const nextSeasonBtn = screen.getByText(/Next Season/i)
    fireEvent.click(nextSeasonBtn) // Season 2
    fireEvent.click(nextSeasonBtn) // Season 3 -> triggers Berry Bush

    // New species should appear
    expect(screen.getByText('Berry Bush')).toBeInTheDocument()

    // Notification should appear in both notification area and game log
    const messages = screen.getAllByText(/New species introduced: Berry Bush!/i)
    expect(messages.length).toBeGreaterThanOrEqual(1)
  })

  test('multiple season changes introduce multiple species', () => {
    render(<GameBlank />)

    const nextSeasonBtn = screen.getByText(/Next Season/i)

    // Advance to season 5
    for (let i = 0; i < 5; i++) fireEvent.click(nextSeasonBtn)

    expect(screen.getByText('Berry Bush')).toBeInTheDocument()
    expect(screen.getByText('Deer')).toBeInTheDocument()

    // Messages appear in both notification area and game log
    const berryMessages = screen.getAllByText(/New species introduced: Berry Bush!/i)
    expect(berryMessages.length).toBeGreaterThanOrEqual(1)

    const deerMessages = screen.getAllByText(/New species introduced: Deer!/i)
    expect(deerMessages.length).toBeGreaterThanOrEqual(1)
  })

})

