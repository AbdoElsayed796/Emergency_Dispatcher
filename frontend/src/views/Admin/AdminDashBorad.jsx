import { useEffect, useState } from "react";
import {
  Users,
  Car,
  Building2,
  AlertCircle,
  MapPin,
} from "lucide-react";

import ResponseTimeReports from "./Reports/ResponseTimeReports";
import UtilizationReports from './Reports/UtilizationReports';
import TopPerformingUnits from "./Reports/TopPerformingUnits";

const AdminDashboard = () => {

  const [stats, setStats] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        fetch("http://localhost:8080/api/admin/stats"),
        fetch("http://localhost:8080/incidents/active"),
      ]);
     
      const statsData = await statsRes.json();
      const incidentsData = await incidentsRes.json();
      console.log(incidentsData);
      setStats(statsData);
      setActiveIncidents(incidentsData);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-600 text-red-100 border-red-700";
      case "HIGH":
        return "bg-orange-600 text-orange-100 border-orange-700";
      case "MEDIUM":
        return "bg-yellow-500 text-yellow-900 border-yellow-600";
      case "LOW":
        return "bg-green-600 text-green-100 border-green-700";
      default:
        return "bg-gray-500 text-gray-100 border-gray-600";
    }
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case "REPORTED":
        return "text-red-600";
      case "ASSIGNED":
        return "text-blue-600";
      case "ON ROUTE":
        return "text-orange-600";
      case "RESOLVED":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-700 text-lg">Loading dashboard...</div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-3xl font-bold"> {stats?.totalUsers || 0}</h3>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        {/* Vehicles */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Vehicles</p>
              <h3 className="text-3xl font-bold">{stats?.activeVehicles || 0}</h3>
              <p className="text-xs text-gray-600">
                {stats?.availableVehicles || 0} available
              </p>
            </div>
            <Car className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Stations */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Stations</p>
              <h3 className="text-3xl font-bold">{stats?.stations || 0}</h3>
            </div>
            <Building2 className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Pending Requests</p>
              <h3 className="text-3xl font-bold text-red-600">{stats?.pendingRequests || 0}</h3>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>


      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-bold mb-4">Active Incidents</h3>

        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Severity</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {activeIncidents.map((incident) => (
              <tr key={incident.id} className="border-b">
                <td className="px-3 py-2">#{incident.id}</td>
                <td className="px-3 py-2">{incident.type}</td>
                <td className="px-3 py-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {incident.location.latitude }
                  {"   , "}
                  {incident.location.longitude }
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(
                      incident.severityLevel
                    )}`}
                  >
                    {incident.severityLevel}
                  </span>
                </td>
                <td className={`px-3 py-2 font-semibold ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {activeIncidents.length === 0 && (
          <p className="text-gray-500 text-center py-4">No active incidents</p>
        )}
      </div>
      <div className="mt-8">
        <ResponseTimeReports />
      </div>
      <div className="mt-8">
        <UtilizationReports />
      </div>
      <div className="mt-8">
        <TopPerformingUnits />
      </div>
    </div>
  );
};

export default AdminDashboard;
