import React, { useState } from 'react'
import './QuestionMark.css'
import questionMarkImg from '../assets/question-mark.png'
import pyramidImg from '../assets/pyrimad.png'

export default function QuestionMark() {
  const [open, setOpen] = useState(false)

  return (
    <span className="question-mark">
      <button
        type="button"
        className="question-mark-button"
        onClick={() => setOpen(true)}
        aria-label="Help"
        title="Help"
      >
        <img src={questionMarkImg} alt="Help" />
      </button>

      {open && (
        <div className="question-mark-backdrop" onClick={() => setOpen(false)}>
          <div className="question-mark-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="question-mark-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <img src={pyramidImg} alt="Pyramid" className="question-mark-image" />
          </div>
        </div>
      )}
    </span>
  )
}