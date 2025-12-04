import React from 'react';
import { MapPin, Activity, Users, Building2 } from 'lucide-react';
import { getTypeColor, getVehicleStatusColor } from '../../utils/dispatcherHelpers.jsx';

const VehiclesGrid = ({ vehicles }) => {

    // Helper to format location from LocationDTO
    const formatLocation = (location) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(4) || 'N/A'}, ${location.longitude?.toFixed(4) || 'N/A'}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.length === 0 ? (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                            No vehicles found
                        </div>
                    ) : (
                        vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getVehicleStatusColor(vehicle.status)}`}></div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Vehicle #{vehicle.id}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(vehicle.type)}`}>
                                                {vehicle.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Activity className="w-4 h-4" />
                                        <span>Status: <span className="font-medium">{vehicle.status}</span></span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{formatLocation(vehicle.location)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>Capacity: <span className="font-medium">{vehicle.capacity || 'N/A'}</span></span>
                                    </div>

                                    {vehicle.stationName && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="w-4 h-4" />
                                            <span>Station: <span className="font-medium">{vehicle.stationName}</span></span>
                                        </div>
                                    )}

                                    {vehicle.responderName && (
                                        <div className="text-gray-600">
                                            Responder: <span className="font-medium">{vehicle.responderName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehiclesGrid;