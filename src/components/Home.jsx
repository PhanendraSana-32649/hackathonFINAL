import React from 'react'

export default function Home({onNavigate}){
  return (
    <section className="card home">
      <div className="space-between">
        <div>
          <h3>Welcome to EMS</h3>
          <div className="small">Use the menu to navigate. Open Live Votes to see trends.</div>
        </div>
        <div>
          <button className="btn" onClick={()=>onNavigate('live')}>Go to Live Votes</button>
        </div>
      </div>

      <hr />
      <div className="grid-3">
        <div className="card">
          <h4>Real-time Voting</h4>
          <p className="small">Simulated live votes and transparent block log.</p>
          <button className="btn" onClick={()=>onNavigate('live')}>Go</button>
        </div>
        <div className="card">
          <h4>Report Complaints</h4>
          <p className="small">Report issues (demo).</p>
        </div>
        <div className="card">
          <h4>Voting Contenders</h4>
          <p className="small">PARTY A, PARTY B, PARTY C</p>
        </div>
      </div>
    </section>
  )
}
