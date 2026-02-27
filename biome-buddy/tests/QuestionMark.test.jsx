import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuestionMark from '../src/game/QuestionMark.jsx'

describe('QuestionMark popup', () => {
  test('opens the popup with title and list', () => {
    render(<QuestionMark />)

    fireEvent.click(screen.getByLabelText(/help/i))

    expect(
      screen.getByText(/how the species interact with one another in the ecosystem\?/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/producers create energy from the sun/i)).toBeInTheDocument()
  })

  test('close button closes the popup', () => {
    render(<QuestionMark />)

    fireEvent.click(screen.getByLabelText(/help/i))
    fireEvent.click(screen.getByLabelText(/close/i))

    expect(
      screen.queryByText(/how the species interact with one another in the ecosystem\?/i)
    ).toBeNull()
  })
})
