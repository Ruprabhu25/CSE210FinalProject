import React from 'react'
import Popup from '../../components/Popup/Popup'
import './Options.css'

export default function AboutPopup({ onClose, darkMode = false }) {
  if (!onClose) return null

  return (
    <Popup frameClassName="instructions-frame" onClose={onClose} darkMode={darkMode}>
      <div className="popup-header">
        <h1>About 🌿</h1>
      </div>

      <p className="instructions-intro">
        Step into the role of a community working to restore an ecosystem. 
        <br></br>
        Over the course of the seasons and years, your choices will directly affect the food chain and ecosystem balance
        <br></br>
        Learn how small actions can lead to big changes as you work to protect biodiversity.
      </p>

      <div className="actions">
        <button className="primary" onClick={onClose}>
          Go Back
        </button>
      </div>
    </Popup>
  )
}
