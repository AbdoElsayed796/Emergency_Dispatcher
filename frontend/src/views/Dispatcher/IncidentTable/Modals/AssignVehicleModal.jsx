import React from 'react';
import { X, Truck, MapPin, Users } from 'lucide-react';
import { getTypeColor, getSeverityBadge } from '../../../../utils/dispatcherHelpers.jsx';

const AssignVehicleModal = ({
                                selectedIncident,
                                availableVehicles,
                                loadingVehicles,
                                onAssign,
                                onClose
                            }) => {

    // Helper to format location
    const formatLocation = (location) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`;
    };

    // Filter vehicles by incident type (matching capability)
    const compatibleVehicles = availableVehicles.filter(vehicle => {
        // Match vehicle type with incident type
        // FIRE incident -> FIRE vehicle
        // MEDICAL incident -> AMBULANCE vehicle
        // POLICE incident -> POLICE vehicle
        const incidentType = selectedIncident?.type;
        const vehicleType = vehicle.type;

        if (incidentType === 'FIRE') return vehicleType === 'FIRE';
        if (incidentType === 'MEDICAL') return vehicleType === 'MEDICAL';
        if (incidentType === 'POLICE') return vehicleType === 'POLICE';

        return true;
    });

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Assign Vehicle</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Assign a vehicle to incident: <span className="font-medium">#{selectedIncident?.id}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Incident Details */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Incident Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Type:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getTypeColor(selectedIncident?.type)}`}>
                                    {selectedIncident?.type}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Severity:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSeverityBadge(selectedIncident?.severityLevel)}`}>
                                    {selectedIncident?.severityLevel}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-600">Location:</span>
                                <span className="ml-2 font-medium">{formatLocation(selectedIncident?.location)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Available Vehicles */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-4">
                            Compatible Vehicles ({compatibleVehicles.length})
                        </h4>

                        {loadingVehicles ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-gray-600">Loading available vehicles...</p>
                            </div>
                        ) : compatibleVehicles.length === 0 ? (
                            <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                                <Truck className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                <p className="text-gray-700 font-medium">No compatible vehicles available</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    All {selectedIncident?.type} vehicles are currently busy
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {compatibleVehicles.map(vehicle => (
                                    <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">Vehicle #{vehicle.id}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                                    <span className={`px-2 py-0.5 rounded-full ${getTypeColor(vehicle.type)}`}>
                                                        {vehicle.type}
                                                    </span>
                                                    {vehicle.stationName && (
                                                        <span>Station: {vehicle.stationName}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate">{formatLocation(vehicle.location)}</span>
                                                </div>
                                                {vehicle.responderName && (
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <Users className="w-3 h-3" />
                                                        <span>Responder: {vehicle.responderName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <button
                                                onClick={() => onAssign(vehicle.id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignVehicleModal;