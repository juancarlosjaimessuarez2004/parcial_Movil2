import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './components/HomePage'
import UsersPage from './components/UsersPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HomePage />
      <UsersPage/>
    </>
  )
}

export default App
