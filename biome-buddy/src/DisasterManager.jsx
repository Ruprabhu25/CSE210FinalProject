import './App.css'
import { showDisaster, DISASTER_TEXTS } from './disasterBus'

export default function DisasterManager() {
    function triggerRandom() {
        const keys = Object.keys(DISASTER_TEXTS)
        const k = keys[Math.floor(Math.random() * keys.length)]
        showDisaster(k)
    }

    return (
        <div className="disaster-root">
            <div className="controls">
                <button onClick={triggerRandom}>Trigger Random Disaster</button>
            </div>
        </div>
    )
}
