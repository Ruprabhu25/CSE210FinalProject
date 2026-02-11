import React from 'react'
import './ConfirmModal.css'
export default function ConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Confirm biome choice" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" aria-label="Close" onClick={onClose}>✕</button>
        <h2>You chose the Forest Biome</h2>
        <p style={{ marginTop: 8, marginBottom: 18 }}>Be prepared to encounter wildfires, landslides, outbreaks and more!</p>
        <div className="confirm-actions">
          <button
            className="btn-primary"
            onClick={() => {
              onConfirm()
            }}
          >
            Get started
          </button>
          <button className="btn-ghost" onClick={onClose}>Go back</button>
        </div>
      </div>
    </div>
  )
}