import React, { useState, useEffect } from 'react';
import { Car, MapPin, Building2, Save, Loader2 } from 'lucide-react';
import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080/api/responder"
})

const ResponderVehicle = () => {
    const userId = 9;
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [status, setStatus] = useState("");

    useEffect(() => {
        void fetchVehicle();
    }, []);

    const fetchVehicle = async () => {
        try {
            setLoading(true);

            const response = await client.get("/vehicle", {
                params: {
                    responderUserId: userId
                }
            })
            const responderVehicle = response.data
            if (responderVehicle) {
                setVehicle(responderVehicle);
                setLatitude(responderVehicle.location.latitude)
                setLongitude(responderVehicle.location.longitude)
                setStatus(responderVehicle.status);
            } else {
                console.warn('No vehicle found');
            }
        } catch (error) {
            console.error('Error fetching vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationUpdate = async () => {
        try {
            setUpdating(true);
            const updatedVehicle = await client.put("/update-vehicle-location", {}, {
                params: {
                    vehicleId: vehicle.id,
                    latitude,
                    longitude
                }
            })
            setVehicle(updatedVehicle.data)
        } catch (error) {
            console.error('Error updating location:', error);
            alert('Failed to update location');
        } finally {
            setUpdating(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);
            const updatedVehicle =  await client.put("/update-vehicle-status", {}, {
                params: {
                    vehicleId: vehicle.id,
                    status
                }
            })
            setVehicle(updatedVehicle.data)
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            AVAILABLE: 'bg-green-100 text-green-700',
            ON_ROUTE: 'bg-blue-100 text-blue-700',
            BUSY: 'bg-yellow-100 text-yellow-700',
            MAINTENANCE: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getTypeBadgeColor = (type) => {
        const colors = {
            FIRE: 'bg-orange-100 text-orange-700',
            POLICE: 'bg-blue-100 text-blue-700',
            MEDICAL: 'bg-red-100 text-red-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading vehicle information...</span>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Vehicle Assigned</h2>
                <p className="text-gray-600">You don't have a vehicle assigned to you yet. Please contact your administrator.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Vehicle</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your vehicle status and location</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Vehicle Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(vehicle.type)}`}>
                    {vehicle.type}
                  </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Capacity</label>
                                <p className="text-lg text-gray-900 mt-1">{vehicle.capacity} people</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Station</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Building2 className="w-4 h-4 text-gray-400" />
                                    <p className="text-lg text-gray-900">
                                        {vehicle.stationName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Editable Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 mb-2 block">Vehicle Status</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="ON_ROUTE">On Route</option>
                                        <option value="BUSY">Busy</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                    </select>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updating || status === vehicle.status}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                    >
                                        {updating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Update
                                    </button>
                                </div>
                                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(vehicle.status)}`}>
                    Current: {vehicle.status}
                  </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 mb-2 block">Vehicle Location</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="latitude"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="latitude,longitude"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleLocationUpdate}
                                        disabled={updating}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                    >
                                        {updating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Update
                                    </button>
                                </div>
                                <p className="text-xs mt-2">Current: ({vehicle.location.latitude}, {vehicle.location.longitude})</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderVehicle;

