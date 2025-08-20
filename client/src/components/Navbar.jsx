import React from 'react'

export default function Navbar({ user, onLogout }) {
  return (
    <div className="nav container">
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <span style={{fontWeight:800}}>🏥 Health Monitor</span>
        <span className="badge">{user?.role?.toUpperCase()}</span>
      </div>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <span className="small">Signed in as <b>{user?.name || 'User'}</b></span>
        <button className="btn secondary" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}