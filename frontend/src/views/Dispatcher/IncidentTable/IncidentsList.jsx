import React from 'react';
import { MapPin, Truck, Navigation, Eye, Clock, Trash2 } from 'lucide-react';
import { getTypeColor, getSeverityBadge, getStatusBadge } from '../../../utils/dispatcherHelpers.jsx';

const IncidentsList = ({
    filteredIncidents,
    handleAssignClick,
    handleTrackClick,
    handleViewDetailsClick,
    handleDeleteClick // <- new prop for delete
}) => {

    // Helper to format time difference
    const getWaitTime = (reportedTime) => {
        if (!reportedTime) return 'N/A';
        const now = new Date();
        const reported = new Date(reportedTime);
        const diffMs = now - reported;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m`;
    };

    // Helper to format location from LocationDTO
    const formatLocation = (location) => {
        if (!location) return 'Unknown';
        return `${location.latitude?.toFixed(4) || 'N/A'}, ${location.longitude?.toFixed(4) || 'N/A'}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredIncidents.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                No incidents found
                            </td>
                        </tr>
                    ) : (
                        filteredIncidents.map((incident) => (
                            <tr key={incident.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{incident.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(incident.type)}`}>
                                        {incident.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="max-w-xs truncate" title={formatLocation(incident.location)}>
                                            {formatLocation(incident.location)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityBadge(incident.severityLevel)}`}>
                                        {incident.severityLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(incident.status)}`}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {getWaitTime(incident.reportedTime)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex flex-col gap-1">
                                    {incident.status === 'REPORTED' && (
                                        <button
                                            onClick={() => handleAssignClick(incident)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
                                        >
                                            <Truck className="w-3 h-3" />
                                            Assign Vehicle
                                        </button>
                                    )}
                                    {incident.status === 'ASSIGNED' && (
                                        <button
                                            onClick={() => handleTrackClick(incident)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center gap-1"
                                        >
                                            <Navigation className="w-3 h-3" />
                                            Track
                                        </button>
                                    )}
                                    {incident.status === 'RESOLVED' && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleViewDetailsClick(incident)}
                                                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-300"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(incident.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-700"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                    {incident.status !== 'REPORTED' && incident.status !== 'ASSIGNED' && incident.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => handleViewDetailsClick(incident)}
                                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-300"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentsList;
