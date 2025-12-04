import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { useState, useEffect } from 'react'
import Admin from "./views/Admin/Admin";
import AdminDashboard from "./views/Admin/AdminDashBorad";
import Users from "./components/User/Users";   
import Vehicles from "./components/Vehicles/Vehicles";
import Stations from "./components/Stations/Stations";
import Login from './components/Auth/Login';
import Incident from './components/Incident/Incident';
import './App.css'


function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path='/' element={<Incident />}></Route>
      <Route path="/login" element={<Login />}> </Route>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="stations" element={<Stations />} />
      </Route>
    </Routes>

  );
}

export default App;
