import React from 'react';
import { Filter, Search } from 'lucide-react';
import DropdownFilter from '../../../components/shared/DropdownFilter.jsx';

const IncidentFilters = ({
                             searchQuery,
                             setSearchQuery,
                             selectedType,
                             setSelectedType,
                             selectedStatus,
                             setSelectedStatus,
                             selectedSeverity,
                             setSelectedSeverity
                         }) => {

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4 flex-wrap">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>

                {/* Type Filter - matches backend IncidentType enum */}
                <DropdownFilter
                    label="Incident Type"
                    value={selectedType}
                    onChange={setSelectedType}
                    options={["FIRE", "MEDICAL", "POLICE"]}
                    placeholder="All Types"
                    className="w-44"
                />

                {/* Severity Filter - matches backend SeverityLevel enum */}
                <DropdownFilter
                    label="Severity"
                    value={selectedSeverity}
                    onChange={setSelectedSeverity}
                    options={["CRITICAL", "HIGH", "MEDIUM", "LOW"]}
                    placeholder="All Severities"
                    className="w-44"
                />

                {/* Status Filter - matches backend IncidentStatus enum */}
                <DropdownFilter
                    label="Status"
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={["REPORTED", "ASSIGNED", "RESOLVED"]}
                    placeholder="All Statuses"
                    className="w-44"
                />

                <div className="flex-1"></div>

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search incidents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default IncidentFilters;