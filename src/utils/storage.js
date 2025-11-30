import React from 'react'

const LS = {
  get(k, fallback){try{return JSON.parse(localStorage.getItem(k)) ?? fallback}catch(e){return fallback}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))},
  rm(k){localStorage.removeItem(k)}
}

function seedData(){
  if(!LS.get('votes')){
    LS.set('votes',{"PARTY A":120,"PARTY B":90,"PARTY C":75})
  }
  if(!LS.get('blocks')) LS.set('blocks',[])
  if(!LS.get('voteHistory')){
    const v=LS.get('votes',{});
    LS.set('voteHistory',[{time:Date.now(),"PARTY A":v['PARTY A']||0,"PARTY B":v['PARTY B']||0,"PARTY C":v['PARTY C']||0}])
  }
}

seedData()

export function SeedProvider({children}){
  return <>{children}</>
}

export function useStorage(){
  const [votes, setVotesState] = React.useState(LS.get('votes',{}))
  const [blocks, setBlocks] = React.useState(LS.get('blocks',[]))

  React.useEffect(()=>{
    const onStorage = ()=>{
      setVotesState(LS.get('votes',{}))
      setBlocks(LS.get('blocks',[]))
    }
    window.addEventListener('storage', onStorage)
    return ()=>window.removeEventListener('storage', onStorage)
  },[])

  function setVotes(v){LS.set('votes',v);setVotesState(v)}

  function pushSnapshot(v){
    const hist = LS.get('voteHistory',[])
    hist.push({time:Date.now(),"PARTY A":v['PARTY A']||0,"PARTY B":v['PARTY B']||0,"PARTY C":v['PARTY C']||0})
    while(hist.length>60) hist.shift()
    LS.set('voteHistory',hist)
  }

  async function addBlock(party, votesObject){
    const blocks = LS.get('blocks',[])
    const prev = blocks.length?blocks[blocks.length-1].hash:'0'
    const time = Date.now()
    const totalVotes = (votesObject?((votesObject['PARTY A']||0)+(votesObject['PARTY B']||0)+(votesObject['PARTY C']||0)):((LS.get('votes')||{})))
    const data = party+time+JSON.stringify(totalVotes)
    const hash = await sha1(data+Math.random())
    const block = {time,party,totalVotes,prev,hash}
    blocks.push(block)
    while(blocks.length>20) blocks.shift()
    LS.set('blocks',blocks)
    setBlocks(blocks)
  }

  function pushSnapshotFromState(){ pushSnapshot(LS.get('votes',{})) }

  return { votes, setVotes, blocks, addBlock, pushSnapshot:pushSnapshotFromState, setVotesState }
}

function sha1(str){
  const enc = new TextEncoder().encode(str)
  return crypto.subtle.digest('SHA-1', enc).then(buf=>Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''))
}
