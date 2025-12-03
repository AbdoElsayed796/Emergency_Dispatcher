import { Routes, Route } from "react-router-dom";

import Admin from "./views/Admin/Admin";
import AdminDashboard from "./views/Admin/AdminDashBorad";



function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
      </Route>


    </Routes>

  );
}

export default App;
