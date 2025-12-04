import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Login from './components/Auth/Login';
import Incident from './components/Incident/Incident';
import './App.css'
import DispatcherDashboard from "./views/Dispatcher/DispatcherDashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Incident />}></Route>
        <Route path="/login" element={<Login />}> </Route>
        <Route path="/dispatcher" element={<DispatcherDashboard />} />
      </Routes>
      
      
    </BrowserRouter>
  )
}

export default App
