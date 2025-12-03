import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Login from './components/Auth/Login';
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}> </Route>
      </Routes>
      
      
    </BrowserRouter>
  )
}

export default App
