import React from 'react'

export default function Alert({ messages=[] }) {
  if (!messages.length) return null
  return (
    <div className="alert">
      <b>Alert:</b> {messages.join(' • ')}
    </div>
  )
}