import React from 'react'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from "@testing-library/react";
import App from '../src/home/home.jsx'

describe('Home page — modal and navigation behaviors', () => {
  beforeEach(() => {
    // ensure we start on home
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Forest button is accessible and opens the confirm modal', () => {
    render(<App />)

    const forestButton = screen.getByLabelText(/Start Game/i)
    expect(forestButton).toBeInTheDocument()

    fireEvent.click(forestButton)
    expect(screen.getByText(/Welcome to the Forest Biome/i)).toBeInTheDocument()
  })

  test('Clicking backdrop closes the modal', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/Start Game/i))

    // dialog role is on the backdrop (modal-backdrop)
    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop) // clicking backdrop should close

    // modal content should no longer be in the document
    expect(screen.queryByText(/Welcome to the Forest Biome/i)).toBeNull()
  })

  test('Pressing Escape closes the modal', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/Start Game/i))

    // fire Escape keyboard event
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('Close button (✕) closes the modal', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/Start Game/i))

    const closeButton = screen.getByLabelText(/Close/i) || screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('"Get started" pushes /game and hides modal', () => {
    render(<App />)

    const pushSpy = vi.spyOn(window.history, 'pushState')
    fireEvent.click(screen.getByLabelText(/Start Game/i))

    const getStarted = screen.getByRole('button', { name: /Get started/i }) || screen.getByText(/Get started/i)
    fireEvent.click(getStarted)

    expect(pushSpy).toHaveBeenCalled()
    // modal should hide
    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('About button is accessible and opens the about modal', () => {
    render(<App />)

    const forestButton = screen.getByLabelText(/About/i)
    expect(forestButton).toBeInTheDocument()

    fireEvent.click(forestButton)
    expect(screen.getByText(/Step into the role of a community/i)).toBeInTheDocument()
  })

  test('About button is accessible and opens the about modal', () => {
    render(<App />)

    const forestButton = screen.getByLabelText(/Credits/i)
    expect(forestButton).toBeInTheDocument()

    fireEvent.click(forestButton)
    expect(screen.getByText(/Biome Buddies was lovingly made by:/i)).toBeInTheDocument()
  })
})