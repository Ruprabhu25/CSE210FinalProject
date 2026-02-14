import './SpeciesPanel.css'
import React from 'react'


export default function SpeciesPanel({ speciesArr, selected, setSelected, icons, nextSeason, getPopulationSize,  onPlayerAction = () => {} }) {
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
                <div className="speciesPop">{Math.round(getPopulationSize?.(s.name) ?? 0)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ height: 8 }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => {
              const name = speciesArr?.[selected]?.name
              onPlayerAction?.(name) // calls only if defined; passes undefined if no species selected
            }} className='growthButtons'>Next Round</button>
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
