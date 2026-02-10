import './App.css'
import DisasterManager from './DisasterManager'
import DisasterPopup from './DisasterPopup'

function App() {
  return (
    <div className="app-root">
      <header>
        <h1>Biome Buddy — Disaster Simulator</h1>
      </header>
      <main>
        <DisasterManager />
      </main>
      <DisasterPopup />
    </div>
  )
}

export default App
