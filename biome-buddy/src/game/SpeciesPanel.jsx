import React from 'react'
import './SpeciesPanel.css'

export default function SpeciesPanel({ speciesArr, selected, setSelected, icons, growthInput, changeGrowth, updateGrowthForSelected, setGrowthInput, nextSeason, getPopulationSize }) {
  return (
    <div className='outerPanelStyle'>
      <div className='innerPanelStyle' aria-label="Species panel">
        <div className="speciesTitle">Active Species</div>
        <div className='selectorStyle' role="listbox" aria-label="Species selector">
          {speciesArr.map((s, i) => (
            <div
              key={s.name}
              className={`itemStyle ${selected === i ? 'selected' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSelected(i) }}
            >
              <div className="iconStyle">{icons[s.trophic] || '🐾'}</div>
              <div>
                <div className="speciesName">{s.name}</div>
                <div className="speciesPop">{Math.round(getPopulationSize?.(s.speciesid) ?? 0)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ height: 8 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>Growth rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => {
              if (speciesArr[selected]) {
                updateGrowthForSelected(speciesArr[selected].growthRate - 0.05)
                nextSeason()
              }
            }} className='growthButtons'>-</button>
            <span style={{ width: 50, textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{growthInput}</span>
            <button onClick={() => {
              if (speciesArr[selected]) {
                updateGrowthForSelected(speciesArr[selected].growthRate + 0.05)
                nextSeason()
              }
            }} className='growthButtons'>+</button>
          </div>
        </div>

      </div>
    </div>
  )
}
