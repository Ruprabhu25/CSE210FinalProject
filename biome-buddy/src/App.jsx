import './App.css'
import DisasterDemo from './components/DisasterPopup/DisasterDemo'
import GameLog from './components/GameLog/GameLog'

function App() {
  return (
    <div className="app-root">
      <main className="app-main">
        <div className="content">
          <DisasterDemo />
        </div>
      </main>
      <GameLog />
    </div>
  )
}

export default App
