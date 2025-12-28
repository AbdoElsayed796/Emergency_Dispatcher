import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, Users, Car, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import login from '../../api/services/login.js';
import { notificationService } from "../../api/services/index.js";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import AdminHeader from "./AdminHeader";

const NavLink = ({ to, label, Icon, active }) => {
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
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await notificationService.getByRole("ADMIN");
        setNotifications(notificationData);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // WebSocket for real-time notifications
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ Admin WebSocket connected");

        client.subscribe("/topic/notification", (msg) => {
          console.log("WS ADMIN NOTIFICATIONS:", msg.body);
          setNotifications(JSON.parse(msg.body));
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      }
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await login.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b py-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Smart Emergency Dispatch Optimization System</p>
        </div>
        
        {/* AdminHeader component for notification and user icons */}
        <AdminHeader
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          notifications={notifications}
          handleLogout={handleLogout}
        />
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

      {/* Backdrop for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Admin;