import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Helper functions for the Dispatcher Dashboard
 * Updated to match backend DTOs and enums
 */

// Backend IncidentType enum: FIRE, MEDICAL, POLICE
export const getTypeColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-300';

    switch (type.toUpperCase()) {
        case 'FIRE':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'MEDICAL':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'POLICE':
            return 'bg-purple-100 text-purple-800 border-purple-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

// Backend SeverityLevel enum: CRITICAL, HIGH, MEDIUM, LOW
export const getSeverityBadge = (severity) => {
    if (!severity) return 'bg-gray-100 text-gray-800';

    switch (severity.toUpperCase()) {
        case 'CRITICAL':
            return 'bg-red-100 text-red-800 border border-red-300';
        case 'HIGH':
            return 'bg-orange-100 text-orange-800 border border-orange-300';
        case 'MEDIUM':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'LOW':
            return 'bg-green-100 text-green-800 border border-green-300';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
};

// Backend IncidentStatus enum: REPORTED, ASSIGNED, RESOLVED
export const getStatusBadge = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toUpperCase()) {
        case 'REPORTED':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'ASSIGNED':
            return 'bg-blue-100 text-blue-800 border border-blue-300';
        case 'RESOLVED':
            return 'bg-green-100 text-green-800 border border-green-300';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
};

// Backend VehicleStatus enum: AVAILABLE, ON_ROUTE, BUSY, MAINTENANCE
export const getVehicleStatusColor = (status) => {
    if (!status) return 'bg-gray-400';

    switch (status.toUpperCase()) {
        case 'AVAILABLE':
            return 'bg-green-500';
        case 'ON_ROUTE':
            return 'bg-blue-500';
        case 'BUSY':
            return 'bg-orange-500';
        case 'MAINTENANCE':
            return 'bg-red-500';
        default:
            return 'bg-gray-400';
    }
};

// Backend VehicleType enum: FIRE, AMBULANCE, POLICE
export const getVehicleTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
        case 'FIRE':
            return '🚒';
        case 'AMBULANCE':
            return '🚑';
        case 'POLICE':
            return '🚓';
        default:
            return '🚗';
    }
};

// Notification icons for different types
export const getNotificationIcon = (type) => {
    switch (type) {
        case 'urgent':
            return <AlertTriangle className="w-5 h-5 text-red-600" />;
        case 'warning':
            return <AlertCircle className="w-5 h-5 text-orange-600" />;
        case 'success':
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'info':
        default:
            return <Info className="w-5 h-5 text-blue-600" />;
    }
};

// Format timestamp to readable format
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return timestamp;
    }
};

// Calculate time difference in minutes
export const getTimeDifference = (startTime) => {
    if (!startTime) return 0;
    try {
        const start = new Date(startTime);
        const now = new Date();
        return Math.floor((now - start) / 60000); // minutes
    } catch {
        return 0;
    }
};

// Format location from LocationDTO
export const formatLocation = (location) => {
    if (!location || !location.latitude || !location.longitude) {
        return 'Location Unknown';
    }
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
};

// Get status color for priority
export const getPriorityColor = (severity) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL':
            return 'text-red-600 bg-red-50';
        case 'HIGH':
            return 'text-orange-600 bg-orange-50';
        case 'MEDIUM':
            return 'text-yellow-600 bg-yellow-50';
        case 'LOW':
            return 'text-green-600 bg-green-50';
        default:
            return 'text-gray-600 bg-gray-50';
    }
};