import React from 'react'
import './SpeciesPanel.css'

export default function SpeciesPanel({ speciesArr, selected, setSelected, icons, growthInput, changeGrowth, updateGrowthForSelected, setGrowthInput, nextSeason }) {
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
                <div className="speciesPop">{Math.round(s.population ?? 0)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ height: 8 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>Growth rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => changeGrowth(-0.05)} className='growthButtons'>-</button>
            <input
              type="text"
              value={growthInput}
              onChange={(e) => setGrowthInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') updateGrowthForSelected(parseFloat(growthInput) || 0) }}
              style={{ width: 84, padding: '6px 8px', borderRadius: 8, border: '1px solid #ccc' }}
            />
            <button onClick={() => changeGrowth(0.05)} style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>+</button>
            <button onClick={() => updateGrowthForSelected(parseFloat(growthInput) || 0)} className='growthButtons'>Enter</button>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>
              <button onClick={nextSeason} className='growthButtons'>Next Season</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
