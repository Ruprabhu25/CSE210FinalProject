import React from 'react'
import '../../components/DisasterPopup/DisasterPopup.css'
import './InstructionsPopup.css'

export default function InstructionsPopup({ onClose }) {
  if (!onClose) return null

  return (
    <div className="overlay">
      <div className="popup-frame instructions-frame">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Welcome to Biome Buddy! 🌿</h2>
          </div>

          <p className="instructions-intro">
            You are the steward of a Forest ecosystem. Your goal is to keep
            nature in balance by supporting species and responding to
            disasters&mdash;before the ecosystem collapses.
          </p>

          <ul className="instructions-list">
            <li>
              <span className="instr-label">Select a species</span> each round
              to boost its population growth, or skip to let nature run its
              course.
            </li>
            <li>
              <span className="instr-label">Advance rounds</span> with the
              &ldquo;Next Round&rdquo; button. Seasons cycle through Spring,
              Summer, Fall, and Winter as rounds pass.
            </li>
            <li>
              <span className="instr-label">Disasters strike</span> at random&mdash;wildfires,
              floods, droughts, landslides, and invasive species. When one
              hits, choose a response action wisely.
            </li>
            <li>
              <span className="instr-label">Ecosystem Health</span> measures
              how balanced your food chain is. Keep Producers (🌿), Herbivores
              (🐇), and Carnivores (🦊 🦅) in proportion to stay healthy.
            </li>
            <li>
              <span className="instr-label">Watch the Event Log</span> on the
              right to track what&apos;s happening in the forest each round.
            </li>
          </ul>

          <div className="actions">
            <button className="primary" onClick={onClose}>
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
