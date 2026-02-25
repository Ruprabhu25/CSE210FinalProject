import React, { useState } from 'react'
import './RightPane.css'
import SettingsButton from './SettingsButton'

export default function RightPane({ darkMode, setDarkMode }) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
  }

  const handleTextToSpeech = () => {
    // Check if read aloud is enabled
    const readAloudEnabled = localStorage.getItem('biomeBuddyReadAloudEnabled')
    if (readAloudEnabled === 'false') {
      alert('Read Aloud is disabled in Settings. Please enable it to use this feature.')
      return
    }

    // Stop any ongoing speech
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Text to read
    const text = "Welcome to Biome Buddy. Step into the role of a community working to restore an ecosystem. Over the course of the seasons and years, your choices will directly affect the food chain and ecosystem balance. Learn how small actions can lead to big changes as you work to protect biodiversity."
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Select a male voice
    const voices = window.speechSynthesis.getVoices()
    const maleVoice = voices.find(voice => 
      voice.name.includes('Male') || 
      voice.name.includes('Daniel') ||
      voice.name.includes('David') ||
      voice.name.includes('Fred') ||
      voice.name.includes('Alex')
    )
    if (maleVoice) {
      utterance.voice = maleVoice
    }
    
    utterance.rate = 1  
    utterance.pitch = 1.1 
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`right-pane ${darkMode ? 'dark-mode' : ''}`}>
      <SettingsButton darkMode={darkMode} onDarkModeToggle={handleDarkModeToggle} />
      <div className="right-inner">
        <div className="welcome-text">Welcome to</div>
        <h1 className="title">Biome Buddy</h1>
        <div className="description-with-speaker">
          <button 
            className={`speaker-button ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleTextToSpeech}
            aria-label={isSpeaking ? "Stop reading text" : "Read text aloud"}
            title={isSpeaking ? "Stop reading" : "Read aloud"}
          >
            {isSpeaking ? '⏸' : '🔊'}
          </button>
          <div className="right-description">
            <p>Step into the role of a community working to restore an ecosystem.</p>
            <p>Over the course of the seasons and years, your choices will directly affect the food chain and ecosystem balance.</p>
            <p>Learn how small actions can lead to big changes as you work to protect biodiversity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
