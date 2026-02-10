import React, { useEffect, useRef, useState } from 'react'
import { subscribe } from './disasterBus'
import './App.css'

export default function DisasterPopup() {
    const [active, setActive] = useState(null)

    const timerRef = useRef(null)
    useEffect(() => {
        const unsub = subscribe((payload) => {
            setActive(payload)
            // clear any previous timer
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            if (payload && payload.autoDismiss !== false) {
                timerRef.current = setTimeout(() => setActive(null), payload.duration ?? 6000)
            }
        })
        return () => {
            unsub()
            if (timerRef.current) clearTimeout(timerRef.current)
        }
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
