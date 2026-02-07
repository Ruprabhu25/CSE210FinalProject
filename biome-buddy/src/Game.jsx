import { useState, useEffect } from 'react'
import { Producer, PrimaryConsumer, SecondaryConsumer, TertiaryConsumer } from './lib/species'

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

  // inline styles to avoid relying on global/home CSS
  const rootStyle = {
    position: 'fixed',
    inset: 0,
    margin: 0,
    padding: 0,
    background: '#ffffff',
    zIndex: 9999,
    display: 'block',
  }

  // wooden frame outer style
  const outerPanelStyle = {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    height: '220px',
    padding: 6,
    boxSizing: 'border-box',
    borderRadius: 12,
    // wood-like gradient for frame
    background: 'linear-gradient(180deg, #7a4f26 0%, #5d3418 50%, #8b5a33 100%)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.45) inset, 0 8px 24px rgba(0,0,0,0.3)',
  }

  // inner panel (less wooden background, lighter tone)
  const innerPanelStyle = {
    height: '100%',
    borderRadius: 8,
    padding: '12px 18px',
    background: '#efe6d8', // light, desaturated beige
    color: '#222',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
  }

  const selectorStyle = {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    padding: '6px 4px',
  }

  const itemStyle = (active) => ({
    minWidth: 120,
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    border: active ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
    cursor: 'pointer',
  })

  const iconStyle = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    marginBottom: 6,
    background: 'rgba(255,255,255,0.04)',
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  }

  const thStyle = {
    textAlign: 'left',
    fontSize: '0.9rem',
    color: '#6b6b6b',
    padding: '6px 8px',
  }

  const tdStyle = {
    padding: '6px 8px',
    fontSize: '0.95rem',
    color: '#222',
  }

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
    <div style={rootStyle}>
      {/* empty game canvas area (intentionally blank) */}
      <div style={{ width: '100%', height: '100%' }} />

      {/* species panel anchored to the bottom with wooden frame */}
      <div style={outerPanelStyle} aria-hidden>
        <div style={innerPanelStyle} aria-label="Species panel">
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <strong style={{ color: '#2b2b2b', fontSize: '1rem' }}>Species</strong>
          </div>

          {/* horizontal selector with pictures */}
          <div style={selectorStyle} role="listbox" aria-label="Species selector">
          {speciesArr.map((s, i) => {
            const isHovered = hovered === i
            const isSelected = i === selected
            return (
              <div
                key={i}
                role="option"
                tabIndex={0}
                aria-selected={isSelected}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{
                  ...itemStyle(isSelected),
                  transform: isHovered ? 'translateY(-6px)' : undefined,
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  boxShadow: isHovered ? '0 8px 20px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                <div
                  style={{
                    ...iconStyle,
                    transform: isHovered ? 'scale(1.14)' : 'scale(1)',
                    transition: 'transform 160ms ease, box-shadow 160ms ease',
                    boxShadow: isHovered ? '0 10px 24px rgba(0,0,0,0.18)' : 'none',
                    border: isSelected ? '2px solid rgba(0,0,0,0.12)' : undefined,
                  }}
                >
                  {icons[s.trophic] || '🐾'}
                </div>
                <div style={{ fontSize: 14, color: '#111' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#111' }}>{Math.round(s.population)}</div>
              </div>
            )
          })}
        </div>

        {/* controls: +/- and direct input for growth rate of selected species */}
        <div style={{ height: 8 }} />

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#444', minWidth: 90 }}>Growth rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => changeGrowth(-0.01)}
              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
              aria-label="Decrease growth rate"
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
              aria-label="Growth rate input"
            />
            <button
              onClick={() => changeGrowth(0.01)}
              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
              aria-label="Increase growth rate"
            >
              +
            </button>
            <button
              onClick={() => updateGrowthForSelected(parseFloat(growthInput) || 0)}
              style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', marginLeft: 6, fontSize: 12 }}
              aria-label="Apply growth rate"
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
