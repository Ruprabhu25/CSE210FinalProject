// Popup for a single disaster; rendered only when a disaster prop is provided
import "./DisasterPopup.css";
import React from "react";

export default function DisasterPopup({ disaster, onAction }) {
  if (!disaster) return null;

  const handleAction = (action) => {
    if (onAction) onAction(action);
  };
  const formatEffect = (delta, target) => `${delta > 0 ? "+" : ""}${delta} ${target}`;

  return (
    <div className="overlay">
      <div className="popup-frame">
        <div className="popup-content">
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
              <button
                key={i}
                className="primary"
                onClick={() => handleAction(action)}
              >
                {typeof action === "string"
                  ? action
                  : `${action.label} (${formatEffect(
                      action.deltaPopulation || 0,
                      action.target
                    )})`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
