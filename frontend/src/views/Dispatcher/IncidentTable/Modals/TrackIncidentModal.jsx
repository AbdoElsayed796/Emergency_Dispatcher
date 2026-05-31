import React from 'react';
import { X, Navigation, Clock, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getTypeColor, getStatusBadge } from '../../../../utils/dispatcherHelpers.jsx';

const TrackIncidentModal = ({
    selectedIncident,
    onStatusUpdate,
    onClose
}) => {

    // Helper to create modern animated icons
    const createModernIcon = (emoji, color) =>
        new L.DivIcon({
            html: `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
        <div style="
          position: relative;
          font-size: 24px;
          transform: translateY(-4px);
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          z-index: 10;
        ">${emoji}</div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: rotate(-45deg) scale(1); }
            50% { transform: rotate(-45deg) scale(1.05); }
          }
        </style>
      </div>
    `,
            className: "",
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
        });

    // Get icon details based on incident type
    const getIncidentIcon = (type) => {
        if (type === "FIRE") return { emoji: "🔥", color: "#FF4757" };
        if (type === "MEDICAL") return { emoji: "🩺", color: "#3498DB" };
        if (type === "POLICE") return { emoji: "👮", color: "#2C3E50" };
        return { emoji: "❗", color: "#FF6B6B" };
    };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                    {/* Live Map */}
                    <div className="mt-6 h-96 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
                        <style>{`
                            .leaflet-container {
                                background: #e5e3df;
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                width: 100%;
                                height: 100%;
                            }
                            .leaflet-popup-content-wrapper {
                                border-radius: 12px;
                                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                                padding: 4px;
                            }
                            .leaflet-popup-content {
                                margin: 12px;
                                font-size: 14px;
                                line-height: 1.6;
                            }
                            .custom-popup-header {
                                font-weight: 600;
                                font-size: 16px;
                                color: #1a1a1a;
                                margin-bottom: 8px;
                                padding-bottom: 8px;
                                border-bottom: 2px solid #f0f0f0;
                            }
                            .custom-popup-row {
                                display: flex;
                                justify-content: space-between;
                                margin: 4px 0;
                                font-size: 13px;
                            }
                            .custom-popup-label {
                                color: #666;
                                font-weight: 500;
                            }
                            .custom-popup-value {
                                color: #1a1a1a;
                                font-weight: 600;
                            }
                            .leaflet-control-zoom a {
                                border-radius: 8px !important;
                                font-size: 20px !important;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
                            }
                            .leaflet-bar {
                                border: none !important;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                                border-radius: 12px !important;
                            }
                        `}</style>

                        {selectedIncident?.location?.latitude && selectedIncident?.location?.longitude ? (
                            <MapContainer
                                key={`${selectedIncident.location.latitude}-${selectedIncident.location.longitude}`}
                                center={[selectedIncident.location.latitude, selectedIncident.location.longitude]}
                                zoom={15}
                                style={{ width: "100%", height: "100%" }}
                                zoomControl={true}
                                attributionControl={false}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                />

                                <Marker
                                    position={[selectedIncident.location.latitude, selectedIncident.location.longitude]}
                                    icon={createModernIcon(
                                        getIncidentIcon(selectedIncident.type).emoji,
                                        getIncidentIcon(selectedIncident.type).color
                                    )}
                                >
                                    <Popup>
                                        <div>
                                            <div className="custom-popup-header">
                                                {getIncidentIcon(selectedIncident.type).emoji} Incident #{selectedIncident.id}
                                            </div>
                                            <div className="custom-popup-row">
                                                <span className="custom-popup-label">Type:</span>
                                                <span className="custom-popup-value">{selectedIncident.type}</span>
                                            </div>
                                            <div className="custom-popup-row">
                                                <span className="custom-popup-label">Status:</span>
                                                <span className="custom-popup-value">{selectedIncident.status}</span>
                                            </div>
                                            <div className="custom-popup-row">
                                                <span className="custom-popup-label">Location:</span>
                                                <span className="custom-popup-value">{formatLocation(selectedIncident.location)}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="font-medium">No location data available</p>
                                    <p className="text-sm mt-1">Map will appear when location is provided</p>
                                </div>
                            </div>
                        )}
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