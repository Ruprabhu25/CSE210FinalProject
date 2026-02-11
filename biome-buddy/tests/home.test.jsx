import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/home/home.jsx'

describe('Home page — modal and navigation behaviors', () => {
  beforeEach(() => {
    // ensure we start on home
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Forest button is accessible and opens the confirm modal', async () => {
    render(<App />)
    const user = userEvent.setup()

    const forestButton = screen.getByLabelText(/Choose Forest Biome/i)
    expect(forestButton).toBeInTheDocument()

    await user.click(forestButton)
    expect(screen.getByText(/You chose the Forest Biome/i)).toBeInTheDocument()
  })

  test('Clicking backdrop closes the modal', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByLabelText(/Choose Forest Biome/i))

    // dialog role is on the backdrop (modal-backdrop)
    const backdrop = screen.getByRole('dialog')
    await user.click(backdrop) // clicking backdrop should close

    // modal content should no longer be in the document
    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('Pressing Escape closes the modal', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByLabelText(/Choose Forest Biome/i))

    // fire Escape keyboard event
    await user.keyboard('{Escape}')

    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('Close button (✕) closes the modal', async () => {
    render(<App />)
    const user = userEvent.setup()
    await user.click(screen.getByLabelText(/Choose Forest Biome/i))

    const closeButton = screen.getByLabelText(/Close/i) || screen.getByText('✕')
    await user.click(closeButton)

    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('"Get started" pushes /game and hides modal', async () => {
    render(<App />)
    const user = userEvent.setup()

    const pushSpy = vi.spyOn(window.history, 'pushState')
    await user.click(screen.getByLabelText(/Choose Forest Biome/i))

    const getStarted = screen.getByRole('button', { name: /Get started/i }) || screen.getByText(/Get started/i)
    await user.click(getStarted)

    expect(pushSpy).toHaveBeenCalled()
    // modal should hide
    expect(screen.queryByText(/You chose the Forest Biome/i)).toBeNull()
  })

  test('Right pane renders title and descriptive paragraphs', () => {
    render(<App />)
    expect(screen.getByText(/Biome Buddy/i)).toBeInTheDocument()
    expect(screen.getByText(/Step into the role of a community/i)).toBeInTheDocument()
  })
})