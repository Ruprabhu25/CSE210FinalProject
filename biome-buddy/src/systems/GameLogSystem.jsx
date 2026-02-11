class GameLogSystem extends System {
    constructor() {
        this.entries = []
        this.listeners = []
    }

    apply(context) {
        // no-op
    }

    addEntry({ season = 'Unknown', message = '', name = '', timestamp = Date.now() } = {}) {
        const entry = {
            season,
            name: name || undefined,
            message: message || name || '',
            timestamp,
            id: `${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
        }
        // newest first
        this.entries.unshift(entry)
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
