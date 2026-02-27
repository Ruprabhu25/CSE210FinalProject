import React from 'react'
import {render, screen} from '@testing-library/react'
import GameEnd from '../src/game/GameEnd.jsx'

describe('GameEnd Component', () => {

  test('renders nothing when result is null', () => {
    const { container } = render(
      <GameEnd
        result={null}
        health={0.8}
        speciesCount={5}
        extinctSpecies={[]}
      />
    )

    expect(container.firstChild).toBeNull()
  })


  test('renders win screen correctly', () => {
    render(
      <GameEnd
        result="win"
        health={0.85}
        speciesCount={6}
        extinctSpecies={[]}
      />
    )

    expect(screen.getByText('The Forest Thrives!')).toBeInTheDocument()
    expect(screen.getByText(/Species Saved:/)).toHaveTextContent('Species Saved: 6')
    expect(screen.getByText(/Ecosystem Health:/)).toHaveTextContent('85.00%')
    expect(screen.getByRole('button')).toHaveTextContent('Play Again')
  })


  test('renders lose screen correctly', () => {
    render(
      <GameEnd
        result="lose"
        health={0.5}
        speciesCount={6}
        extinctSpecies={[]}
      />
    )

    expect(screen.getByText('The Forest Struggles...')).toBeInTheDocument()

    // Species saved = total - extinct
    expect(screen.getByText(/Species Saved:/)).toHaveTextContent('Species Saved: 6')

    expect(screen.getByText(/Ecosystem Health:/)).toHaveTextContent('50.00%')
    expect(screen.getByRole('button')).toHaveTextContent('Try a new approach!')
  })


  test('shows extinct species list when health is 0 and species extinct', () => {
    render(
      <GameEnd
        result="lose"
        health={0}
        speciesCount={6}
        extinctSpecies={['Fox', 'Rabbit']}
      />
    )
    expect(screen.getByText(/Species Saved:/)).toHaveTextContent('Species Saved: 4')

    expect(
      screen.getByText(/Species that went extinct:/)
    ).toHaveTextContent('Fox, Rabbit')
  })


  test('does NOT show extinct section if health is not zero', () => {
    render(
      <GameEnd
        result="lose"
        health={0.3}
        speciesCount={6}
        extinctSpecies={['Fox']}
      />
    )

    expect(
      screen.queryByText(/Species that went extinct:/)
    ).toBeNull()
  })
})