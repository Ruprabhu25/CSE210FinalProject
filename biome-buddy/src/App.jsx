import './App.css'
import DisasterManager from './DisasterManager'
import DisasterPopup from './DisasterPopup'

function App() {
  return (
    <div className="app-root">
      <main>
        <DisasterManager />
      </main>
      <DisasterPopup />
    </div>
  )
}

export default App
