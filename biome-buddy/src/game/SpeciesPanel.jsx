import './SpeciesPanel.css'
import React, { useEffect, useState } from 'react'
import { speciesSprites } from './speciesSprites'


export default function SpeciesPanel({ speciesArr, selected, setSelected, icons, nextSeason, getPopulationSize,  onPlayerAction }) {
  const [burstSprite, setBurstSprite] = useState(null)
  const [burstKey, setBurstKey] = useState(0)

  function triggerBurst(speciesName) {
    const sprite = speciesSprites[speciesName]
    if (!sprite) return
    setBurstSprite(sprite)
    setBurstKey((k) => k + 1) // re-trigger animation even if same sprite
  }

  return (
    <div className="outerPanelStyle">
      {/* Overlay animation (doesn’t block clicks) */}
      {burstSprite && (
        <div className="burstOverlay" aria-hidden>
          <img
            key={burstKey}
            className="burstSprite"
            src={burstSprite}
            alt=""
            onAnimationEnd={() => setBurstSprite(null)}
          />
        </div>
      )}

      <div className="innerPanelStyle" aria-label="Species panel">
        <div className="speciesTitle">Active Species</div>

        <div className="selectorStyle" role="listbox" aria-label="Species selector">
          {speciesArr.map((s, i) => (
            <div
              key={s.name}
              className={`itemStyle ${selected === i ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(i)
                triggerBurst(s.name)
                onPlayerAction?.(s.name)
              }}
            >
              <div className="iconStyle">{icons[s.trophic] || '🐾'}</div>
              <div>
                <div className="speciesName">{s.name}</div>
                <div className="speciesPop">{Math.round(getPopulationSize?.(s.name) ?? 0)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 8 }} />

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => {
                const name = speciesArr?.[selected]?.name
                onPlayerAction?.(name) // undefined if no selection
              }}
              className="growthButtons"
            >
              Next Round
            </button>

            <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>
              {speciesArr?.[selected]
                ? `You have selected ${speciesArr[selected].name}, their population growth rate will increase.`
                : 'You have not selected a species, the population growth rate will stay as is.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
