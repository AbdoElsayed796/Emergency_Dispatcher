import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, MapPin, Loader2, FileText } from 'lucide-react';
import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080/api/assignments"
})


const ResponderCurrentIncident = () => {
    const vehicleId = 1
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(false);

    useEffect(() => {
        void fetchCurrentAssignment();
    }, []);

    const fetchCurrentAssignment = async () => {
        try {
            setLoading(true);

            const response = await client.get("", {
                params: {
                    vehicleId
                }
            });

            const assignments = response.data;

            setCurrentAssignment(assignments.find(assignment => (assignment.timeAccepted && !assignment.timeFinished)))
        } catch (error) {
            console.error('Error fetching current incident:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveIncident = async () => {
        if (!window.confirm('Are you sure you want to mark this incident as resolved? This will allow you to take on another incident.')) {
            return;
        }

        try {
            setResolving(true);

            await client.patch("/resolve", {}, {
                params: {
                    assignmentId: currentAssignment.id
                }
            })

            setCurrentAssignment(null);
            alert('Incident resolved successfully! You can now take on another incident.');
        } catch (error) {
            console.error('Error resolving incident:', error);
            alert('Failed to resolve incident');
        } finally {
            setResolving(false);
        }
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
                <span className="ml-3 text-gray-600">Loading current incident...</span>
            </div>
        );
    }

    if (!currentAssignment) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Incident</h2>
                <p className="text-gray-600">You don't have an active incident at the moment. Check the Incidents tab to take on an incident.</p>
            </div>
        );
    }

    const incident = currentAssignment.incident

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Incident</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your active incident</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(incident.type)}`}>
                  {incident.type}
                </span>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadgeColor(incident.severityLevel)}`}>
                  {incident.severityLevel}
                </span>
                                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {incident.status}
                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleResolveIncident}
                            disabled={resolving || incident.status === 'RESOLVED'}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {resolving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            Mark as Resolved
                        </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4" />
                                    Time Reported
                                </label>
                                <p className="text-lg text-gray-900">{formatDate(incident.reportedTime)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </label>
                                <p className="text-lg text-gray-900">
                                    {incident.location.latitude}, {incident.location.longitude}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {incident.reporterName && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-1 block">Reporter</label>
                                    <p className="text-lg text-gray-900">{incident.reporterName}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {incident.description && (
                        <div className="border-t pt-6">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Description</label>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{incident.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    {incident.additionalInfo && (
                        <div className="border-t pt-6 mt-6">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Additional Information</label>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{incident.additionalInfo}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResponderCurrentIncident;

