import React, { useEffect, useState, useRef } from 'react'
import logStore from '../../logStore'
import './GameLog.css'

export default function GameLog() {
    const [entries, setEntries] = useState([])
    const [collapsed, setCollapsed] = useState(false)
    const listRef = useRef(null)

    useEffect(() => {
        // subscribe to store updates for UI
        const unsubStore = logStore.subscribe((list) => {
            setEntries(list)
        })
        return () => {
            unsubStore()
        }
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
                    entries.map((e) => (
                        <div className="game-log-entry" key={e.id}>
                            <div className="game-log-entry-season">{e.season}</div>
                            <div className="game-log-entry-message">{e.message}</div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    )
}
