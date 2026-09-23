import { useState } from 'react'
import './App.css'
import Notes from './Notes'
import PrivateNotes from './PrivateNotes'
import Settings from './Settings'

function App() {
  const [route, setRoute] = useState('notes')

  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd', display: 'flex', gap: 8 }}>
        <button onClick={() => setRoute('notes')}>Ghi chú</button>
        <button onClick={() => setRoute('private')}>Ghi chú riêng</button>
        <button onClick={() => setRoute('settings')}>Cài đặt</button>
      </header>

      <main style={{ padding: 20 }}>
        {route === 'notes' && <Notes />}
        {route === 'private' && <PrivateNotes />}
        {route === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default App
