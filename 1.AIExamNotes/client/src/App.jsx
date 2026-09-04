
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Home  from './pages/Home'
import Dashboard from './pages/Dashboard'
export const serverUrl = "http://localhost:4000"

function App() {
  return (
      <>
      <Routes>
        <Route path = '/' element={<Home/>}/>
        <Route path = '/auth' element={<Auth/>}/>
        <Route path = '/dashboard' element={<Dashboard/>}/>
        </Routes>
       
    </>
  )
}

export default App

