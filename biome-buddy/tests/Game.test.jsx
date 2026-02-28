import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, beforeEach, expect, vi } from 'vitest'
import GameBlank from '../src/game/Game'
import SpeciesPanel from '../src/game/SpeciesPanel'
import GameTop from '../src/game/GameTop'
import gameLogSystem from '../src/components/GameLog/GameLogSystem'
import InstructionsPopup from '../src/components/InstructionsPopup/InstructionsPopup'

describe('Game integration and components', () => {

	beforeEach(() => {
		// ensure game log is clean between tests
		gameLogSystem.clear()
	})

	test('GameTop shows health text and season badge', () => {
		render(<GameTop currentSeason={'Spring'} />)
		expect(screen.getByText(/EcoSystem Health/i)).toBeInTheDocument()
		expect(screen.getByText('Spring')).toBeInTheDocument()
	})

	test('SpeciesPanel renders species and Next Round behavior (no selection)', () => {
		const mockOnPlayer = vi.fn()
		const speciesArr = [
			{ name: 'Grass', speciesid: 1, trophic: 'Producers' },
			{ name: 'Rabbit', speciesid: 4, trophic: 'Primary Consumers' }
		]

		render(
			<SpeciesPanel
				speciesArr={speciesArr}
				selected={null}
				setSelected={() => {}}
				icons={{ 'Primary Consumers': '🐇', 'Producers': '🌿' }}
				nextSeason={() => {}}
				onPlayerAction={mockOnPlayer}
				getPopulationSize={() => 0}
			/>
		)

		// both species names should render
		expect(screen.getByText('Grass')).toBeInTheDocument()
		expect(screen.getByText('Rabbit')).toBeInTheDocument()

		// message should indicate no selection
		expect(screen.getByText(/You have not selected a species/i)).toBeInTheDocument()

		// Next Round should call onPlayerAction with undefined
		fireEvent.click(screen.getByText(/Next Round/i))
		expect(mockOnPlayer).toHaveBeenCalledWith(undefined)
	})

	test('SpeciesPanel passes selected species name to onPlayerAction', () => {
		const mockOnPlayer = vi.fn()
		const speciesArr = [
			{ name: 'Grass', speciesid: 1, trophic: 'Producers' },
			{ name: 'Rabbit', speciesid: 4, trophic: 'Primary Consumers' }
		]

		render(
			<SpeciesPanel
				speciesArr={speciesArr}
				selected={1}
				setSelected={() => {}}
				icons={{ 'Primary Consumers': '🐇', 'Producers': '🌿' }}
				nextSeason={() => {}}
				onPlayerAction={mockOnPlayer}
				getPopulationSize={() => 0}
			/>
		)

		fireEvent.click(screen.getByText(/Next Round/i))
		expect(mockOnPlayer).toHaveBeenCalledWith('Rabbit')
	})

	test('GameBlank renders initial UI and species list', () => {
		render(<GameBlank />)
		fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }))

		expect(screen.getByText(/EcoSystem Health/i)).toBeInTheDocument()
		// season badge or initial game log entry should include Season or Year
		const seasonEls = screen.getAllByText(/Season 1|Year 1/i)
		expect(seasonEls.length).toBeGreaterThanOrEqual(1)

		// initial species are present
		expect(screen.getByText('Grass')).toBeInTheDocument()
		expect(screen.getByText('Rabbit')).toBeInTheDocument()
		expect(screen.getByText('Fox')).toBeInTheDocument()
		expect(screen.getByText('Hawk')).toBeInTheDocument()
	})

	test('instructions popup is visible on initial render', () => {
		render(<GameBlank />)
		expect(screen.getByRole('heading', { name: /Welcome to Biome Buddy/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Start Playing/i })).toBeInTheDocument()
	})

	test('instructions popup is dismissed after clicking Start Playing', () => {
		render(<GameBlank />)
		fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }))
		expect(screen.queryByRole('heading', { name: /Welcome to Biome Buddy/i })).not.toBeInTheDocument()
	})

	test('GameBlank Next Round logs messages with and without selection', () => {
		render(<GameBlank />)
		fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }))

		const nextBtn = screen.getByText(/Next Round/i)

		// no selection -> logs a per-season message
		fireEvent.click(nextBtn)
		const entriesA = gameLogSystem.getEntries()
		expect(entriesA.length).toBeGreaterThanOrEqual(1)
		expect(entriesA[0].message).toMatch(/seasons turn|struggles|breathes easier|plummeted|fragile|thrives in balance|Life goes on|growing faster/i)

		// select Rabbit and advance -> logs a per-season message
		const rabbit = screen.getByText('Rabbit')
		fireEvent.click(rabbit)
		const entriesB = gameLogSystem.getEntries()
		expect(entriesB[0].message).toMatch(/flourishing|seasons turn|struggles|breathes easier|plummeted|fragile|thrives in balance|Life goes on|growing faster/i)
	})

})

describe('InstructionsPopup', () => {
	test('renders heading, intro text, and start button', () => {
		render(<InstructionsPopup onClose={() => {}} />)
		expect(screen.getByRole('heading', { name: /Welcome to Biome Buddy/i })).toBeInTheDocument()
		expect(screen.getByText(/steward of a Forest ecosystem/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Start Playing/i })).toBeInTheDocument()
	})

	test('calls onClose when Start Playing is clicked', () => {
		const onClose = vi.fn()
		render(<InstructionsPopup onClose={onClose} />)
		fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }))
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	test('renders nothing when onClose is not provided', () => {
		const { container } = render(<InstructionsPopup />)
		expect(container.firstChild).toBeNull()
	})

	test('calls onClose when Escape key is pressed', () => {
		const onClose = vi.fn()
		render(<InstructionsPopup onClose={onClose} />)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledTimes(1)
	})
})

describe('Species visualization', () => {
	test('clicking a species shows a temporary burst sprite', () => {
		const speciesArr = [{ name: 'Rabbit', speciesid: 4, trophic: 'Primary Consumers' }]
		const speciesSprites = { Rabbit: '/src/assets/species/rabbit.png' }

		render(
			<SpeciesPanel
				speciesArr={speciesArr}
				selected={null}
				setSelected={() => {}}
				speciesSprites={speciesSprites}
				onPlayerAction={() => {}}
				getPopulationSize={() => 0}
			/>
		)

		fireEvent.click(screen.getByText('Rabbit'))

		const burstImg = document.querySelector('img.burstSprite')
		expect(burstImg).not.toBeNull()
	})

	test('burst sprite disappears after animation ends', () => {
		const speciesArr = [{ name: 'Rabbit', speciesid: 4, trophic: 'Primary Consumers' }]

		render(
			<SpeciesPanel
				speciesArr={speciesArr}
				selected={null}
				setSelected={() => {}}
				onPlayerAction={() => {}}
				getPopulationSize={() => 0}
			/>
		)

		fireEvent.click(screen.getByText('Rabbit'))

		const burstImg = document.querySelector('img.burstSprite')
		expect(burstImg).not.toBeNull()

		// trigger the cleanup your component actually uses
		fireEvent.animationEnd(burstImg)

		expect(document.querySelector('img.burstSprite')).toBeNull()
	})

	test('selecting species triggers onPlayerAction with species name', () => {
		const onPlayerAction = vi.fn()

		const speciesArr = [{ name: 'Bear', speciesid: 13, trophic: 'Tertiary Consumers' }]

		render(
			<SpeciesPanel
				speciesArr={speciesArr}
				selected={null}
				setSelected={() => {}}
				onPlayerAction={onPlayerAction}
				getPopulationSize={() => 0}
			/>
		)

		fireEvent.click(screen.getByText('Bear'))
		expect(onPlayerAction).toHaveBeenCalledWith('Bear')
	})
})

