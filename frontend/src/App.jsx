import { Routes, Route } from "react-router-dom";

import Admin from "./views/Admin/Admin";
import AdminDashboard from "./views/Admin/AdminDashBorad";
import Users from "./components/User/Users";   
import Vehicles from "./components/Vehicles/Vehicles";
import Stations from "./components/Stations/Stations";
import Responder from "./views/Responder/Responder";
import ResponderVehicle from "./views/Responder/ResponderVehicle";
import ResponderIncidents from "./views/Responder/ResponderIncidents";
import ResponderCurrentIncident from "./views/Responder/ResponderCurrentIncident";


function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="stations" element={<Stations />} />
      </Route>

      {/* Responder Routes */}
      <Route path="/responder" element={<Responder />}>
        <Route path="vehicle" element={<ResponderVehicle />} />
        <Route path="incidents" element={<ResponderIncidents />} />
        <Route path="incident" element={<ResponderCurrentIncident />} />
      </Route>

    </Routes>

  );
}

export default App;
