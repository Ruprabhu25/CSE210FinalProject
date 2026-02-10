import React, { useEffect, useState } from 'react'
import { subscribe } from './disasterBus'
import './App.css'

export default function GameLog() {
    const [entries, setEntries] = useState([])

    useEffect(() => {
        const unsub = subscribe((payload) => {
            const text = payload?.message ?? payload?.name ?? String(payload)
            const timestamp = new Date().toLocaleTimeString()
            setEntries((s) => [{ text: `${timestamp} — ${text}` }, ...s])
        })
        return unsub
    }, [])

    return (
        <aside className="game-log">
            <div className="game-log-header">Event Log</div>
            <div className="game-log-list" role="log" aria-live="polite">
                {entries.length === 0 ? (
                    <div className="game-log-empty">No events yet</div>
                ) : (
                    entries.map((e, i) => (
                        <div className="game-log-entry" key={i}>{e.text}</div>
                    ))
                )}
            </div>
        </aside>
    )
}
