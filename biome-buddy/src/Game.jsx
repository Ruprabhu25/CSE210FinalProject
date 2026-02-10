import { useState, useEffect } from 'react'
import { Producer, PrimaryConsumer, SecondaryConsumer, TertiaryConsumer } from './lib/species'
import './Game.css'

export default function GameBlank() {
  // create some example species for the panel and keep them in state so updates re-render
  const [speciesArr, setSpeciesArr] = useState([
    new Producer('Grass', 1, 0.05, 1000, 0.12),
    new PrimaryConsumer('Rabbit', 4, 0.5, 200, 0.08),
    new SecondaryConsumer('Fox', 20, 5, 20, 0.02),
    new TertiaryConsumer('Hawk', 45, 6, 5, 0.01),
  ])

  const [selected, setSelected] = useState(0)
  const [growthInput, setGrowthInput] = useState(Number(speciesArr[0].growthRate).toFixed(2))
  const [hovered, setHovered] = useState(null)

  
  const icons = {
    'producer': '🌿',
    'primary-consumer': '🐇',
    'secondary-consumer': '🦊',
    'tertiary-consumer': '🦅',
  }

  const sel = speciesArr[selected]

  // keep growthInput in sync when selection changes
  useEffect(() => {
    if (sel) setGrowthInput(Number(sel.growthRate).toFixed(2))
  }, [selected, speciesArr])

  function updateGrowthForSelected(newRate) {
    if (!sel) return
    const r = Math.round((Number(newRate) || 0) * 100) / 100
    sel.setGrowthRate(r)
    // force re-render by replacing the array reference
    setSpeciesArr((prev) => [...prev])
    setGrowthInput(Number(r).toFixed(2))
  }

  // change the input value by delta but do not apply until user presses Enter
  function changeGrowth(delta) {
    const current = Number(growthInput) || 0
    const next = Math.round((current + delta) * 100) / 100
    setGrowthInput(Number(next).toFixed(2))
  }

return (
  <div className='rootStyle' onClick={() => setSelected(null)}>

    {/* Top HUD */}
    <div className="topBar">
      <div className="healthContainer">
        <div className="healthFill" />
        <div className="healthText">EcoSystem Health: 70%</div>
      </div>

      <div className="seasonBadge">Summer</div>
    </div>

    {/* Empty canvas */}
    <div style={{ flex: 1 }} />

    {/* Bottom species panel */}
    <div className='outerPanelStyle' aria-hidden>
      <div className='innerPanelStyle' aria-label="Species panel">

        <div className="speciesTitle">Active Species</div>

        <div className='selectorStyle' role="listbox" aria-label="Species selector">
          {speciesArr.map((s, i) => (
            <div
              key={s.name}
              className={`itemStyle ${selected === i ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(i)
              }}
            >
              <div className="iconStyle">
                {icons[s.trophic] || '🐾'}
              </div>

              <div>
                <div className="speciesName">{s.name}</div>
                <div className="speciesPop">{Math.round(s.population)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ height: 8 }} />

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>Growth rate</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => changeGrowth(-0.01)}
              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              -
            </button>

            <input
              type="text"
              value={growthInput}
              onChange={(e) => setGrowthInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateGrowthForSelected(parseFloat(growthInput) || 0)
                }
              }}
              style={{ width: 84, padding: '6px 8px', borderRadius: 8, border: '1px solid #ccc' }}
            />

            <button
              onClick={() => changeGrowth(0.01)}
              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              +
            </button>

            <button
              onClick={() => updateGrowthForSelected(parseFloat(growthInput) || 0)}
              style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginLeft: 6, fontSize: 12 }}
            >
              Enter
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
)

}
