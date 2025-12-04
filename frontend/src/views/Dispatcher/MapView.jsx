import React from 'react';
import { MapPin } from 'lucide-react';

const MapView = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Map Integration</h3>
                    <p className="text-gray-500">Integrate with Google Maps, Leaflet, or Mapbox</p>
                    <p className="text-sm text-gray-400 mt-2">Display real-time vehicle locations and incident markers</p>
                </div>
            </div>
        </div>
    );
};

export default MapView;