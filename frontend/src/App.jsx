import { Routes, Route } from "react-router-dom";

import Admin from "./views/Admin/Admin";
import AdminDashboard from "./views/Admin/AdminDashBorad";
import Users from "./components/User/Users";   
import Vehicles from "./components/Vehicles/Vehicles";
import Stations from "./components/Stations/Stations";


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


    </Routes>

  );
}

export default App;
