import React, { useEffect } from 'react'
import './Popup.css'

/**
 * Shared popup shell used by DisasterPopup and InstructionsPopup.
 *
 * Renders: overlay → popup-frame → popup-content
 * Pass `frameClassName` to apply an extra modifier class on the frame
 * (e.g. "instructions-frame" to widen it).
 * Pass `onClose` to enable dismissal via the Escape key.
 */
export default function Popup({ children, frameClassName = '', onClose, darkMode = false }) {
  useEffect(() => {
    if (!onClose) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="overlay">
      <div className={['popup-frame', frameClassName, darkMode ? 'dark-mode' : ''].filter(Boolean).join(' ')}>
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  )
}
