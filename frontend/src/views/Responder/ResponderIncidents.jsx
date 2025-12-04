import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock, MapPin, Loader2 } from 'lucide-react';
import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080/api/assignments"
})

const ResponderIncidents = () => {
    const vehicleId = 1;
    const [assignments, setAssignments] = useState([]);
    const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);


    useEffect(() => {
        void fetchCurrentAssignmentId();
        void fetchAssignedIncidents();
        void checkCurrentIncident();
    }, []);

    const fetchCurrentAssignmentId = async () => {
        try {
            setLoading(true);

            const response = await client.get("", {
                params: {
                    vehicleId
                }
            });

            const assignments = response.data;

            setCurrentAssignmentId(assignments.find(assignment => (assignment.timeAccepted && !assignment.timeFinished)).id)
        } catch (error) {
            console.error('Error fetching current incident:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedIncidents = async () => {
        try {
            setLoading(true);

            const response = await client.get("", {
                params: {
                    vehicleId
                }
            })

            setAssignments(response.data)
        } catch (error) {
            console.error('Error fetching incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkCurrentIncident = async () => {

    };

    const handleTakeIncident = async (assignmentId) => {
        if (!window.confirm('Are you sure you want to take on this incident?')) {
            return;
        }

        try {
            setProcessingId(assignmentId);
            await client.patch("/accept", {}, {
                params: {
                    assignmentId
                }
            })
            setCurrentAssignmentId(assignmentId);
            await fetchAssignedIncidents();
            alert('Incident accepted successfully');
        } catch (error) {
            console.error('Error accepting incident:', error);
            alert('Failed to accept incident');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            ASSIGNED: 'bg-blue-100 text-blue-700',
            RESOLVED: 'bg-green-100 text-green-700',
            REPORTED: 'bg-yellow-100 text-yellow-700'
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

    const getSeverityBadgeColor = (severity) => {
        const colors = {
            LOW: 'bg-green-100 text-green-700',
            MEDIUM: 'bg-yellow-100 text-yellow-700',
            HIGH: 'bg-orange-100 text-orange-700',
            CRITICAL: 'bg-red-100 text-red-700'
        };
        return colors[severity] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading incidents...</span>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assigned Incidents</h3>
                <p className="text-gray-600">You don't have any incidents assigned to you at the moment.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assigned Incidents</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage incidents assigned to you</p>
            </div>

            <div className="space-y-4">
                {assignments.map((assignment) => {
                    const incident = assignment.incident
                    const isCurrent = currentAssignmentId === assignment.id;
                    const isProcessing = processingId === assignment.id;
                    const canTake = !currentAssignmentId && assignment.incident.status !== "RESOLVED";

                    return (
                        <div
                            key={incident.id}
                            className={`bg-white rounded-lg shadow-sm border p-6 ${
                                isCurrent ? 'border-blue-500 border-2' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {isCurrent && (
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-700">
                          CURRENT
                        </span>
                                        )}
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(incident.status)}`}>
                        {incident.status}
                      </span>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(incident.type)}`}>
                        {incident.type}
                      </span>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadgeColor(incident.severityLevel)}`}>
                        {incident.severityLevel}
                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Time Reported: {formatDate(incident.reportedTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>
                          Location: {incident.location?.latitude || incident.latitude}, {incident.location?.longitude || incident.longitude}
                        </span>
                                        </div>
                                    </div>

                                    {incident.description && (
                                        <p className="mt-3 text-sm text-gray-700">{incident.description}</p>
                                    )}
                                </div>

                                <div className="ml-4 flex flex-col gap-2">
                                    {canTake && (
                                        <button
                                            onClick={() => handleTakeIncident(assignment.id)}
                                            disabled={isProcessing}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition whitespace-nowrap"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            Take Incident
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResponderIncidents;

