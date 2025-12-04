import React from 'react';
import { X, Navigation, MapPin, Clock, CheckCircle } from 'lucide-react';
import { getTypeColor, getStatusBadge } from '../../../../utils/dispatcherHelpers.jsx';

const TrackIncidentModal = ({
                                selectedIncident,
                                onStatusUpdate,
                                onClose
                            }) => {

    // Helper to format location
    const formatLocation = (location) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`;
    };

    // Calculate wait time
    const getWaitTime = (reportedTime) => {
        if (!reportedTime) return 'N/A';
        try {
            const now = new Date();
            const reported = new Date(reportedTime);
            const diffMs = now - reported;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 60) return `${diffMins} min`;
            const diffHours = Math.floor(diffMins / 60);
            return `${diffHours}h ${diffMins % 60}m`;
        } catch {
            return 'N/A';
        }
    };

    // Handle marking incident as resolved
    const handleMarkResolved = () => {  
            onStatusUpdate('RESOLVED');
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-l flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Track Incident</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Tracking incident: <span className="font-medium">#{selectedIncident?.id}</span>
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
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                            <Navigation className="w-6 h-6 text-blue-600" />
                            <div>
                                <h4 className="font-medium text-gray-900">Vehicle Assigned</h4>
                                <p className="text-sm text-gray-600">
                                    Response vehicle is en route to the incident location
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Incident Details</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID:</span>
                                    <span className="font-medium">#{selectedIncident?.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Type:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(selectedIncident?.type)}`}>
                                        {selectedIncident?.type}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600 block mb-1">Location:</span>
                                    <span className="text-xs font-mono bg-gray-50 p-2 rounded block">
                                        {formatLocation(selectedIncident?.location)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Tracking Information</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedIncident?.status)}`}>
                                        {selectedIncident?.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Wait Time:</span>
                                    <span className="font-medium text-orange-600 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {getWaitTime(selectedIncident?.reportedTime)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="mt-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 font-medium">Live Tracking Map</p>
                            <p className="text-sm text-gray-400 mt-1">Real-time vehicle location would appear here</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleMarkResolved}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Mark as Resolved
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackIncidentModal;