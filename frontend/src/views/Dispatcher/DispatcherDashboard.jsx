import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../../api/services/login.js';
import DispatcherHeader from './DispatcherHeader';
import NavigationTabs from './NavigationTabs';
import StatsCards from './StatsCards';
import IncidentsTable from './IncidentTable/IncidentsTable.jsx';
import VehiclesGrid from './VehiclesGrid';
import MapView from './MapView';
import { vehicleService, incidentService } from "../../api/services/index.js";

// WebSocket
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

const DispatcherDashboard = () => {
    const [activeTab, setActiveTab] = useState('incidents');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [selectedType, setSelectedType] = useState('All Types');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
    const navigate = useNavigate();

    //? State for API data
    const [incidents, setIncidents] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [stats, setStats] = useState({
        activeIncidents: 0,
        availableVehicles: 0,
        onRoute: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const notifications = [
        { id: 1, type: 'urgent', title: 'Critical Incident Unassigned', message: 'INC-002 - Building fire has been waiting for 6 minutes', time: '2 min ago', read: false },
        { id: 2, type: 'warning', title: 'Vehicle Delayed', message: 'FIRE-03 is experiencing traffic delays. ETA +5 minutes', time: '5 min ago', read: false },
        { id: 3, type: 'info', title: 'New Incident Reported', message: 'INC-005 - Medical emergency at Downtown Plaza', time: '10 min ago', read: true },
        { id: 4, type: 'success', title: 'Incident Resolved', message: 'INC-004 has been successfully resolved by AMB-02', time: '15 min ago', read: true },
        { id: 5, type: 'warning', title: 'Low Vehicle Availability', message: 'Only 2 ambulances available in Zone A', time: '20 min ago', read: true }
    ];

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [incidentsData, vehiclesData] = await Promise.all([
                incidentService.getAll(),
                vehicleService.getAll()
            ]);

            setIncidents(incidentsData);
            setVehicles(vehiclesData);
            calculateStats(incidentsData, vehiclesData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (incidentsData, vehiclesData) => {
        setStats({
            activeIncidents: incidentsData.filter(inc => inc.status === 'REPORTED' || inc.status === 'ASSIGNED').length,
            availableVehicles: vehiclesData.filter(v => v.status === 'AVAILABLE').length,
            onRoute: vehiclesData.filter(v => v.status === 'ON_ROUTE').length,
        });
    };

    // ---------- WEBSOCKET ----------
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected");

                client.subscribe("/topic/vehicles", (msg) => {
                    const updatedVehicle = JSON.parse(msg.body);
                    setVehicles(prev => {
                        const exists = prev.find(v => v.id === updatedVehicle.id);
                        if (!exists) return [...prev, updatedVehicle];
                        return prev.map(v => v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v);
                    });
                });

                client.subscribe("/topic/incidents", (msg) => {
                    const updatedIncidents = JSON.parse(msg.body);
                    if (updatedIncidents.length > 0) setIncidents(updatedIncidents);
                });
            },

            onStompError: (frame) => {
                console.error("❌ STOMP error", frame);
            }
        });

        client.activate();
        return () => client.deactivate();
    }, []);

    // Filter logic
    const filteredIncidents = incidents.filter(inc => {
        if (selectedType !== 'All Types' && inc.type !== selectedType) return false;
        if (selectedStatus !== 'All Statuses' && inc.status !== selectedStatus) return false;
        if (selectedSeverity !== 'All Severities' && inc.severityLevel !== selectedSeverity) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                inc.id?.toString().toLowerCase().includes(query) ||
                inc.type?.toLowerCase().includes(query) ||
                inc.status?.toLowerCase().includes(query) ||
                inc.severityLevel?.toLowerCase().includes(query) ||
                inc.location?.latitude?.toString().includes(query) ||
                inc.location?.longitude?.toString().includes(query)
            );
        }
        return true;
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        await login.logout();
        navigate('/');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading && incidents.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DispatcherHeader
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
                notifications={notifications}
                unreadCount={unreadCount}
                handleLogout={handleLogout}
            />

            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-6 max-w-7xl mx-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={fetchAllData}
                            className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <StatsCards stats={stats} />

                {activeTab === 'incidents' && (
                    <IncidentsTable
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        selectedSeverity={selectedSeverity}
                        setSelectedSeverity={setSelectedSeverity}
                        filteredIncidents={filteredIncidents}
                        onIncidentUpdate={fetchAllData}
                        handleDeleteClick={async (id) => {
                            try {
                              await incidentService.delete(id); 
                            } catch (err) {
                              console.error("Failed to delete incident", err);
                            }
                          }}

                    />
                )}

                {activeTab === 'vehicles' && <VehiclesGrid vehicles={vehicles} />}
                {activeTab === 'map' && (
                    <MapView 
                    incidents={incidents} 
                    vehicles={vehicles} 
                    onDeleteIncident={async (id) => {
                      try {
                        await incidentService.delete(id); 
                      } catch (err) {
                        console.error("Failed to delete incident", err);
                      }
                    }}
                  />
                  
                )}
            </div>

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

export default DispatcherDashboard;
