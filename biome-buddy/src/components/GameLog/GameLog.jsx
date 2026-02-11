import React, { useEffect, useState, useRef } from 'react'
import { subscribe } from '../../disasterBus'
import './GameLog.css'

export default function GameLog() {
    const [entries, setEntries] = useState([])
    const [collapsed, setCollapsed] = useState(false)
    const listRef = useRef(null)

    useEffect(() => {
        const unsub = subscribe((payload) => {
            const text = payload?.message ?? payload?.name ?? String(payload)
            setEntries((s) => [{ text: `Season 1 — ${text}` }, ...s])
        })
        return unsub
    }, [])

    useEffect(() => {
        // when new entry added, scroll to top of the list area
        if (listRef.current) {
            listRef.current.scrollTop = 0
        }
    }, [entries])

    return (
        <aside className={"game-log" + (collapsed ? ' collapsed' : '')} aria-hidden={collapsed}>
            <button
                className="game-log-tab"
                aria-label={collapsed ? 'Expand event log' : 'Collapse event log'}
                onClick={() => setCollapsed((c) => !c)}
            >
                <span className="tab-arrow">{collapsed ? '‹' : '›'}</span>
            </button>

            <div className="game-log-header">Event Log</div>
            <div className="game-log-list" role="log" aria-live="polite" ref={listRef}>
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
