import { useEffect, useState } from 'react'
import { subscribe } from './disasterBus'
import './App.css'

export default function DisasterPopup() {
    const [active, setActive] = useState(null)

    useEffect(() => {
        const unsub = subscribe((payload) => {
            setActive(payload)
            if (payload && payload.autoDismiss !== false) {
                const t = setTimeout(() => setActive(null), payload.duration ?? 6000)
                return () => clearTimeout(t)
            }
        })
        return unsub
    }, [])

    if (!active) return null

    return (
        <div className="disaster-popup-inline" role="dialog" aria-live="polite">
            <div className="disaster-popup-card">
                <button className="popup-close" aria-label="Close" onClick={() => setActive(null)}>×</button>
                <h3 className="disaster-title">Natural Disaster has hit!</h3>
                <p className="disaster-body">{active.message}</p>
            </div>
        </div>
    )
}
