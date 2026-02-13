import React from 'react'
import './Notifications.css'

export default function Notifications({ notifications }) {
  return (
    <div className="notificationContainer">
      {notifications.map((note, i) => (
        <div key={i} className="notification">
          {note}
        </div>
      ))}
    </div>
  )
}
