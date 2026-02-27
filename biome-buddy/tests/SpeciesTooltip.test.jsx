import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SpeciesPanel from '../src/game/SpeciesPanel.jsx'

describe('Species tooltip', () => {
  const speciesArr = [{ name: 'Rabbit', trophic: 'Primary Consumers' }]

  const baseProps = {
    speciesArr,
    selected: 0,
    setSelected: () => {},
    icons: { 'Primary Consumers': '🐇' },
    nextSeason: () => {},
    getPopulationSize: () => 123,
    onPlayerAction: () => {},
    darkMode: false
  }

  test('renders tooltip text for trophic level', () => {
    render(<SpeciesPanel {...baseProps} />)

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      /trophic level: primary consumers/i
    )
  })

  test('tooltip remains in DOM on hover', () => {
    const { container } = render(<SpeciesPanel {...baseProps} />)

    const item = container.querySelector('.itemStyle')
    fireEvent.mouseOver(item)

    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })
})
