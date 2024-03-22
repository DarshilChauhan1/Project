import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Routing from './components/Routing'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </>
  )
}

export default App
