import { render, screen, fireEvent } from '@testing-library/react'
import GameBlank from '../Game.jsx'
import { Producer, PrimaryConsumer } from '../lib/species'

describe('GameBlank Component', () => {

  test('renders top HUD and initial species', () => {
    render(<GameBlank />)
    
    // Check ecosystem health
    expect(screen.getByText(/EcoSystem Health/i)).toBeInTheDocument()
    
    // Check initial season
    expect(screen.getByText(/Season 1/i)).toBeInTheDocument()

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

test('changing growth input updates growth rate', () => {
  render(<GameBlank />)

  const input = screen.getByRole('textbox')
  expect(input.value).toBe('0.12') // assert initial value

  fireEvent.change(input, { target: { value: '0.10' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

  expect(input.value).toBe('0.10') // updated value
})


  test('addSpecies function introduces new species and notification', () => {
    render(<GameBlank />)

    // Click next season until new species added (Berry Bush at season 3)
    const nextSeasonBtn = screen.getByText(/Next Season/i)
    fireEvent.click(nextSeasonBtn) // Season 2
    fireEvent.click(nextSeasonBtn) // Season 3 -> triggers Berry Bush

    // New species should appear
    expect(screen.getByText('Berry Bush')).toBeInTheDocument()

    // Notification should appear
    expect(screen.getByText(/New species introduced: Berry Bush!/i)).toBeInTheDocument()
  })

  test('multiple season changes introduce multiple species', () => {
    render(<GameBlank />)

    const nextSeasonBtn = screen.getByText(/Next Season/i)

    // Advance to season 5
    for (let i = 0; i < 5; i++) fireEvent.click(nextSeasonBtn)

    expect(screen.getByText('Berry Bush')).toBeInTheDocument()
    expect(screen.getByText('Deer')).toBeInTheDocument()
    
    expect(screen.getByText(/New species introduced: Berry Bush!/i)).toBeInTheDocument()
    expect(screen.getByText(/New species introduced: Deer!/i)).toBeInTheDocument()
  })

})

