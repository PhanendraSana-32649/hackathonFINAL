import React from 'react'
import { Chart, registerables } from 'chart.js'
import { useStorage } from '../utils/storage'

Chart.register(...registerables)

export default function LiveVotes(){
  const { votes, setVotes, blocks, addBlock, pushSnapshot } = useStorage()
  const barRef = React.useRef(null)
  const trendRef = React.useRef(null)
  const barChartRef = React.useRef(null)
  const trendChartRef = React.useRef(null)

  React.useEffect(()=>{
    const ctx = barRef.current.getContext('2d')
    barChartRef.current = new Chart(ctx,{type:'bar',data:{labels:['PARTY A','PARTY B','PARTY C'],datasets:[{label:'Votes',data:[votes['PARTY A']||0,votes['PARTY B']||0,votes['PARTY C']||0],backgroundColor:['#0b5ed7','#198754','#ffc107']}]} });
    return ()=>{barChartRef.current?.destroy()}
  },[])

  React.useEffect(()=>{
    if(barChartRef.current){barChartRef.current.data.datasets[0].data=[votes['PARTY A']||0,votes['PARTY B']||0,votes['PARTY C']||0];barChartRef.current.update()}
  },[votes])

  React.useEffect(()=>{
    const ctx = trendRef.current.getContext('2d')
    trendChartRef.current = new Chart(ctx,{type:'line',data:{labels:[],datasets:[{label:'PARTY A',data:[],borderColor:'#0b5ed7',fill:false},{label:'PARTY B',data:[],borderColor:'#198754',fill:false},{label:'PARTY C',data:[],borderColor:'#ffc107',fill:false}]},options:{responsive:true}})
    return ()=>trendChartRef.current?.destroy()
  },[])

  React.useEffect(()=>{
    // update trend from localStorage snapshots
    const hist = JSON.parse(localStorage.getItem('voteHistory')||'[]')
    if(!trendChartRef.current) return
    trendChartRef.current.data.labels = hist.map(h=>new Date(h.time).toLocaleTimeString())
    trendChartRef.current.data.datasets[0].data = hist.map(h=>h['PARTY A']||0)
    trendChartRef.current.data.datasets[1].data = hist.map(h=>h['PARTY B']||0)
    trendChartRef.current.data.datasets[2].data = hist.map(h=>h['PARTY C']||0)
    trendChartRef.current.update()
  },[votes, blocks])

  function handleVote(p){
    const v = {...votes}
    v[p] = (v[p]||0) + 1
    setVotes(v)
    pushSnapshot(v)
    addBlock(p, v)
  }

  return (
    <section className="card">
      <div className="space-between"><div><h3>Live Votes</h3><div className="small">Last updated: <span id="votesLast">-</span></div></div></div>
      <hr/>
      <div className="grid-2">
        <div>
          <div className="vote-card">
            <div>
              <div className="vote-buttons">
                <button className="btn" onClick={()=>handleVote('PARTY A')}>Vote PARTY A</button>
                <button className="btn" onClick={()=>handleVote('PARTY B')}>Vote PARTY B</button>
                <button className="btn" onClick={()=>handleVote('PARTY C')}>Vote PARTY C</button>
              </div>
              <div className="small">Totals reflect persisted votes.</div>
            </div>
            <div style={{marginTop:12}}>
              <canvas ref={barRef} />
              <canvas ref={trendRef} style={{marginTop:12}} />
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{height:520,overflow:'auto'}}>
            <h4>Blockchain Log</h4>
            <div id="blockLog">
              {blocks.slice().reverse().map((b,i)=> (
                <div key={i} className="complaint">
                  <div style={{display:'flex',justifyContent:'space-between'}}><div><strong>{b.party}</strong><div className="small">{new Date(b.time).toLocaleString()}</div></div><div className="small">Total:{b.totalVotes}</div></div>
                  <div style={{marginTop:8,fontFamily:'monospace',fontSize:12}}>Hash: {b.hash}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
