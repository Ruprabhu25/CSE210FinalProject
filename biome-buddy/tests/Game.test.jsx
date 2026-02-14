import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, beforeEach, expect, vi } from 'vitest'
import GameBlank from '../src/game/Game'
import SpeciesPanel from '../src/game/SpeciesPanel'
import GameTop from '../src/game/GameTop'
import gameLogSystem from '../src/components/GameLog/GameLogSystem'

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

	test('GameBlank Next Round logs messages with and without selection', () => {
		render(<GameBlank />)

		const nextBtn = screen.getByText(/Next Round/i)

		// no selection -> life goes on message
		fireEvent.click(nextBtn)
		const entriesA = gameLogSystem.getEntries()
		expect(entriesA.length).toBeGreaterThanOrEqual(1)
		expect(entriesA[0].message).toMatch(/Life goes on as usual in the forest/i)

		// select Rabbit and advance -> should log Rabbit growth
		const rabbit = screen.getByText('Rabbit')
		fireEvent.click(rabbit)
		const entriesB = gameLogSystem.getEntries()
		console.log(entriesB)
		expect(entriesB[0].message).toMatch(/Rabbit population is growing faster than usual/i)
	})

})
