import React from 'react';
import { X, CheckCircle, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { getTypeColor, getSeverityBadge, getStatusBadge } from '../../../../utils/dispatcherHelpers.jsx';

const IncidentDetailsModal = ({
                                  selectedIncident,
                                  onAssignClick,
                                  onClose
                              }) => {

    // Helper to format location
    const formatLocation = (location) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(6)}, ${location.longitude?.toFixed(6)}`;
    };

    // Helper to format date/time
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return dateTimeString;
        }
    };

    // Calculate wait time
    const getWaitTime = (reportedTime) => {
        if (!reportedTime) return 'N/A';
        try {
            const now = new Date();
            const reported = new Date(reportedTime);
            const diffMs = now - reported;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 60) return `${diffMins} minutes`;
            const diffHours = Math.floor(diffMins / 60);
            return `${diffHours} hours ${diffMins % 60} minutes`;
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Incident Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Complete information for incident: <span className="font-medium">#{selectedIncident?.id}</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-blue-600" />
                                Basic Information
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Incident ID:</span>
                                    <span className="font-medium">#{selectedIncident?.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Type:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(selectedIncident?.type)}`}>
                                        {selectedIncident?.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Severity:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadge(selectedIncident?.severityLevel)}`}>
                                        {selectedIncident?.severityLevel}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedIncident?.status)}`}>
                                        {selectedIncident?.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location & Time */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Location & Time
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600 block mb-1">Coordinates:</span>
                                    <div className="p-2 bg-gray-50 rounded font-mono text-xs break-all">
                                        {formatLocation(selectedIncident?.location)}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reported At:</span>
                                    <span className="font-medium text-right">
                                        {formatDateTime(selectedIncident?.reportedTime)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Wait Time:</span>
                                    <span className="font-medium text-orange-600 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {getWaitTime(selectedIncident?.reportedTime)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Information */}
                        {selectedIncident?.status === 'RESOLVED' && (
                            <div className="col-span-1 md:col-span-2">
                                <h4 className="font-medium text-gray-900 mb-4">Resolution Details</h4>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-green-700">Incident Resolved</p>
                                            <p className="text-sm text-green-600 mt-1">
                                                This incident has been successfully resolved and closed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Assigned Status */}
                        {selectedIncident?.status === 'ASSIGNED' && (
                            <div className="col-span-1 md:col-span-2">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-blue-700">Vehicle Assigned</p>
                                            <p className="text-sm text-blue-600 mt-1">
                                                A response vehicle has been assigned and is en route to this incident.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reported Status */}
                        {selectedIncident?.status === 'REPORTED' && (
                            <div className="col-span-1 md:col-span-2">
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        <div className="flex-1">
                                            <p className="font-medium text-yellow-700">Awaiting Assignment</p>
                                            <p className="text-sm text-yellow-600 mt-1">
                                                This incident is waiting for a vehicle to be assigned.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                    >
                        Close
                    </button>
                    {selectedIncident?.status === 'REPORTED' && (
                        <button
                            onClick={onAssignClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Assign Vehicle
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncidentDetailsModal;