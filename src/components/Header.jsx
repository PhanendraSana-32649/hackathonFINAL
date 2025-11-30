import React from 'react'

export default function Header({onNavigate}){
  return (
    <header className="header card">
      <div className="brand">
        <div className="logo">EMS</div>
        <div>
          <div style={{fontWeight:700}}>Election Monitoring System</div>
          <div className="small">Transparent. Secure. Accountable.</div>
        </div>
      </div>
      <nav className="nav">
        <button onClick={()=>onNavigate('home')}>Home</button>
        <button onClick={()=>onNavigate('live')}>Live Votes</button>
      </nav>
    </header>
  )
}
