import React from 'react'
import Popup from '../Popup/Popup'
import './ResumePopup.css'

export default function ResumePopup({ onClose, darkMode = false }) {
  if (!onClose) return null

  return (
    <Popup frameClassName="resume-frame" onClose={onClose} darkMode={darkMode}>
      <div className="popup-header">
        <h2>Welcome Back!</h2>
      </div>

      <p className="resume-message">
        Your progress has been saved and restored. Continue managing your ecosystem!
      </p>

      <div className="actions">
        <button className="primary" onClick={onClose}>
          Continue Playing
        </button>
      </div>
    </Popup>
  )
}
