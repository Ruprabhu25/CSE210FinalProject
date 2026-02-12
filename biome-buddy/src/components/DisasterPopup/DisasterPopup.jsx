// Popup for a single disaster; rendered only when a disaster prop is provided
import "./DisasterPopup.css";
import React from "react";

export default function DisasterPopup({ disaster, onClose }) {
  if (!disaster) return null;

  return (
    <div className="overlay">
      <div className="popup-frame">
        <div className="popup-content">
          <button className="close" onClick={onClose}>✕</button>

          <div className="popup-header">
            <h2>{disaster.title}</h2>
            {disaster.icon && (
              <img
                src={disaster.icon}
                alt={`${disaster.title} icon`}
                className="disaster-icon"
              />
            )}
          </div>
          <p>{disaster.description}</p>

          <p className="impact-line">
            <span className="impact-label">Impact:</span> {disaster.impact}
          </p>

          <div className="actions">
            {disaster.actions.map((action, i) => (
              <button key={i} className="primary">
                {action}
              </button>
            ))}
            <button className="secondary" onClick={onClose}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
