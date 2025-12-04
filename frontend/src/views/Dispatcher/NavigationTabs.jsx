import React from 'react';
import { Activity, Truck, MapPin } from 'lucide-react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex gap-1">
                <button
                    onClick={() => setActiveTab('incidents')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'incidents'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Activity className="w-4 h-4 inline mr-2" />
                    Incidents
                </button>
                <button
                    onClick={() => setActiveTab('vehicles')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'vehicles'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Truck className="w-4 h-4 inline mr-2" />
                    Vehicles
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'map'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Live Map
                </button>
            </div>
        </div>
    );
};

export default NavigationTabs;