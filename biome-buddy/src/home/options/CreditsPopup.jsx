import React from 'react'
import Popup from '../../components/Popup/Popup'
import './Options.css'

export default function CreditsPopup({ onClose, darkMode = false }) {
  if (!onClose) return null

  return (
    <Popup frameClassName="instructions-frame" onClose={onClose} darkMode={darkMode}>
      <div className="popup-header">
        <h1>Credits 🌿</h1>
      </div>

      <div className="instructions-intro">
        <h3>Biome Buddies was lovingly made by:</h3>
        <p>
          Uliyaah
          <br></br>
          Angie
          <br></br>
          Shambhavi 
          <br></br>
          Junyue
          <br></br>
          Rahul
          <br></br>
          Ewan
        </p>
        <h3>(with the guidance of Jacob and Michael)</h3>
      </div>

      <div className="actions">
        <button className="primary" onClick={onClose}>
          Go Back
        </button>
      </div>
    </Popup>
  )
}
