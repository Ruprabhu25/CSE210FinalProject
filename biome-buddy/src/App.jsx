import './App.css'
import DisasterManager from './DisasterManager'
import DisasterPopup from './DisasterPopup'
import GameLog from './components/GameLog/GameLog'

function App() {
  return (
    <div className="app-root">
      <main className="app-main">
        <div className="content">
          <DisasterManager />
        </div>
      </main>
      <GameLog />
      <DisasterPopup />
    </div>
  )
}

export default App
