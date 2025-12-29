import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../../api/services/login.js';
import DispatcherHeader from './DispatcherHeader';
import NavigationTabs from './NavigationTabs';
import StatsCards from './StatsCards';
import IncidentsTable from './IncidentTable/IncidentsTable.jsx';
import VehiclesGrid from './VehiclesGrid';
import MapView from './MapView';
import { vehicleService, incidentService , notificationService } from "../../api/services/index.js";


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
    const [notifications, setNotifications] = useState([]);
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

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [incidentsData, vehiclesData , notificationData] = await Promise.all([
                incidentService.getAll(),
                vehicleService.getAll(),
                notificationService.getByRole("DISPATCHER"),
            ]);

            setIncidents(incidentsData);
            setVehicles(vehiclesData);
            setNotifications(notificationData);
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
                console.log("✅ WebSocket connected!");
                client.subscribe("/topic/notification", (msg) => {
                    console.log("WS NOTIFICATIONS:", msg.body);
                    setNotifications(JSON.parse(msg.body));
                });
                // Subscribe to incidents
                client.subscribe("/topic/incidents", (msg) => {
                    console.log("📨 Incidents updated");
                    const updatedIncidents = JSON.parse(msg.body);
                
                    setIncidents(updatedIncidents);
                    calculateStats(updatedIncidents, vehicles);
                });
                
                client.subscribe("/topic/vehicles", (msg) => {
                    console.log("🚗 Vehicle update received!");
                    console.log("Raw message:", msg.body);
                    
                    try {
                        const updatedVehicle = JSON.parse(msg.body);
                        console.log("Parsed vehicle:", updatedVehicle);
                        
                        setVehicles(prev => {
                            const exists = prev.find(v => v.id === updatedVehicle.id);
                            
                            if (!exists) {
                                console.log("Adding new vehicle:", updatedVehicle.id);
                                return [...prev, {
                                    id: updatedVehicle.id,
                                    status: updatedVehicle.status,
                                    type: updatedVehicle.type,
                                    location: {
                                        latitude: updatedVehicle.latitude,
                                        longitude: updatedVehicle.longitude
                                    }
                                }];
                            }
                            
                            console.log("Updating existing vehicle:", updatedVehicle.id);
                            return prev.map(v => {
                                if (v.id === updatedVehicle.id) {
                                    return {
                                        ...v,
                                        status: updatedVehicle.status,
                                        type: updatedVehicle.type,
                                        location: {
                                            latitude: updatedVehicle.latitude,
                                            longitude: updatedVehicle.longitude
                                        }
                                    };
                                }
                                return v;
                            });
                        });
                    } catch (error) {
                        console.error("Error parsing vehicle update:", error);
                    }
                });

            },
            
            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame);
            },
            
            onDisconnect: () => {
                console.log("❌ WebSocket disconnected");
            }
        });
        
        client.activate();
        console.log("🔌 WebSocket client activated");
        
        return () => {
            console.log("🔌 Cleaning up WebSocket connection");
            client.deactivate();
        };
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
