import './SpeciesPanel.css'

export default function SpeciesPanel({ speciesArr, selected, setSelected, icons, nextSeason, getPopulationSize, onPlayerAction }) {
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => {
              // Always call onPlayerAction; pass undefined when no species selected
              const name = speciesArr?.[selected]?.name
              onPlayerAction?.(name)
            }} className='growthButtons'>Next Season</button>
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
