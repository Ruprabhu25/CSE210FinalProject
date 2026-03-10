import System from "../../systems/System"

class GameLogSystem extends System {
    constructor() {
        super()
        this.entries = []
        this.listeners = []
    }

    apply(context) {
        // no-op
    }

    addEntry({ season = 'Unknown', message = '', name = '', timestamp = Date.now(), type = 'game-log-info' } = {}) {
        const entry = {
            season: season.toLowerCase(),
            name: name || undefined,
            message: message || name || '',
            timestamp,
            id: `${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
            type
        }
        // newest first
        this.entries.push(entry)
        this.entries.sort((a, b) => a.timestamp - b.timestamp)
        this.emit()
        return entry
    }

    getEntries() {
        return [...this.entries]
    }

    clear() {
        this.entries = []
        this.emit()
    }

    subscribe(fn) {
        this.listeners.push(fn)
        // send initial snapshot
        fn(this.getEntries())
        return () => {
            this.listeners = this.listeners.filter((l) => l !== fn)
        }
    }

    emit() {
        const snapshot = this.getEntries()
        this.listeners.forEach((fn) => {
            try { fn(snapshot) } catch (e) { console.error('GameLogSystem listener error', e) }
        })
    }
}

const gameLogSystem = new GameLogSystem()
export default gameLogSystem
