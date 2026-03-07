import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest'
import GameBlank from '../src/game/Game'

describe('Resume Popup after Save and Exit', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('shows InstructionsPopup on fresh game (no saved data)', () => {
    render(<GameBlank />)
    
    // Instructions popup should show
    expect(
      screen.getByText(/Welcome to Biome Buddy/i)
    ).toBeInTheDocument()
  })

  test('shows ResumePopup when saved game data exists', () => {
    // Simulate saved game data
    const savedGameState = {
      roundNumber: 2,
      year: 1,
      populations: {}
    }
    localStorage.setItem('biomeBuddySaveData', JSON.stringify(savedGameState))

    render(<GameBlank />)

    // Resume popup should show instead of instructions
    expect(
      screen.getByText(/Welcome Back/i)
    ).toBeInTheDocument()
    
    expect(
      screen.getByText(/Your progress has been saved and restored/i)
    ).toBeInTheDocument()

    // Instructions should NOT show
    expect(
      screen.queryByText(/Welcome to Biome Buddy/i)
    ).toBeNull()
  })

  test('ResumePopup closes when "Continue Playing" is clicked', () => {
    const savedGameState = {
      roundNumber: 2,
      year: 1,
      populations: {}
    }
    localStorage.setItem('biomeBuddySaveData', JSON.stringify(savedGameState))

    render(<GameBlank />)

    // Resume popup should be visible
    expect(
      screen.getByText(/Welcome Back/i)
    ).toBeInTheDocument()

    // Click "Continue Playing" button
    const continueButton = screen.getByRole('button', { name: /Continue Playing/i })
    fireEvent.click(continueButton)

    // Resume popup should close
    expect(
      screen.queryByText(/Welcome Back/i)
    ).toBeNull()
  })

  test('does not show ResumePopup after "Just Exit" (saved data is cleared)', () => {
    // Initial save
    const savedGameState = {
      roundNumber: 1,
      year: 1,
      populations: {}
    }
    localStorage.setItem('biomeBuddySaveData', JSON.stringify(savedGameState))

    // Simulate "Just Exit" by clearing saved data
    localStorage.removeItem('biomeBuddySaveData')

    render(<GameBlank />)

    // Instructions should show instead of resume popup
    expect(
      screen.getByText(/Welcome to Biome Buddy/i)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(/Welcome Back/i)
    ).toBeNull()
  })
})
