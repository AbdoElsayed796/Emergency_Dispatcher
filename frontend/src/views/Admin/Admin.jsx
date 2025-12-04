
import { Link, Outlet, useLocation } from "react-router-dom";
import { Activity, Users, Car, Building2 } from "lucide-react";

const NavLink = ({ to, label,Icon,active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
        active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
};

const Admin = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-600">Smart Emergency Dispatch Optimization System</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 px-6 py-4 bg-white border-b shadow-sm">
        <NavLink to="/admin" label="Dashboard" Icon={Activity} active={location.pathname === "/admin"} />
        <NavLink to="/admin/users" label="Users" Icon={Users} active={location.pathname === "/admin/users"} />
        <NavLink to="/admin/vehicles" label="Vehicles" Icon={Car} active={location.pathname === "/admin/vehicles"} />
        <NavLink to="/admin/stations" label="Stations" Icon={Building2} active={location.pathname === "/admin/stations"} />
      </div>

      {/* Page Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
