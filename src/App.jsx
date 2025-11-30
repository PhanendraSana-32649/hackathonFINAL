import React from 'react'
import Header from './components/Header'
import Home from './components/Home'
import LiveVotes from './components/LiveVotes'
import { SeedProvider } from './utils/storage'

export default function App(){
  const [route, setRoute] = React.useState('home')
  return (
    <SeedProvider>
      <div className="app">
        <Header onNavigate={setRoute} />
        <main className="container">
          {route==='home' && <Home onNavigate={setRoute} />}
          {route==='live' && <LiveVotes />}
        </main>
      </div>
    </SeedProvider>
  )
}
