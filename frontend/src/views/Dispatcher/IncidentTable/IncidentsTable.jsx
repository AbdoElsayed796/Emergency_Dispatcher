import React, { useState, useEffect } from 'react';
import IncidentFilters from './IncidentFilters.jsx';
import IncidentsList from './IncidentsList.jsx';
import AssignVehicleModal from './Modals/AssignVehicleModal.jsx';
import TrackIncidentModal from './Modals/TrackIncidentModal.jsx';
import IncidentDetailsModal from './Modals/IncidentDetailsModal.jsx';
import { vehicleService, incidentService, assignmentService } from '../../../api/services/index.js';

const IncidentsTable = ({
                            searchQuery,
                            setSearchQuery,
                            selectedType,
                            setSelectedType,
                            selectedStatus,
                            setSelectedStatus,
                            selectedSeverity,
                            setSelectedSeverity,
                            filteredIncidents,
                            onIncidentUpdate
                        }) => {
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [modalType, setModalType] = useState(null); // 'assign', 'track', 'details'
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    // Fetch available vehicles when assign modal opens
    useEffect(() => {
        if (modalType === 'assign') {
            fetchAvailableVehicles();
        }
    }, [modalType]);

    const fetchAvailableVehicles = async () => {
        try {
            setLoadingVehicles(true);
            const vehicles = await vehicleService.getAvailableVehicles();
            setAvailableVehicles(vehicles);
        } catch (error) {
            console.error('Error fetching available vehicles:', error);
            setAvailableVehicles([]);
        } finally {
            setLoadingVehicles(false);
        }
    };

    // Handle Assign Button Click
    const handleAssignClick = (incident) => {
        setSelectedIncident(incident);
        setModalType('assign');
    };

    // Handle Track Button Click
    const handleTrackClick = (incident) => {
        setSelectedIncident(incident);
        setModalType('track');
    };

    // Handle View Details Click
    const handleViewDetailsClick = (incident) => {
        setSelectedIncident(incident);
        setModalType('details');
    };

    // Handle Vehicle Assignment
    const handleVehicleAssign = async (vehicleId) => {
        try {
            console.log(`Assigning vehicle ${vehicleId} to incident ${selectedIncident.id}`);

            const response = await assignmentService.assignVehicleToIncident(vehicleId, selectedIncident.id, 1)

            console.log('Assignment successful:', response.data);

            if (onIncidentUpdate) {
                await onIncidentUpdate();
            }

            closeModal();
        } catch (error) {
            console.error('Error assigning vehicle:', error);
            alert('Failed to assign vehicle. Please try again.');
        }
    };

    // Handle Status Update
    const handleStatusUpdate = async (newStatus) => {
        try {
            console.log(`Updating incident ${selectedIncident.id} status to ${newStatus}`);

            await incidentService.updateStatus(selectedIncident.id, { status: newStatus });

            // Refresh data after status update
            if (onIncidentUpdate) {
                await onIncidentUpdate();
            }

            closeModal();
        } catch (error) {
            console.error('Error updating incident status:', error);
            alert('Failed to update incident status. Please try again.');
        }
    };

    // Close Modal
    const closeModal = () => {
        setSelectedIncident(null);
        setModalType(null);
    };

    return (
        <>
            <div className="space-y-6">
                <IncidentFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedSeverity={selectedSeverity}
                    setSelectedSeverity={setSelectedSeverity}
                />

                <IncidentsList
                    filteredIncidents={filteredIncidents}
                    handleAssignClick={handleAssignClick}
                    handleTrackClick={handleTrackClick}
                    handleViewDetailsClick={handleViewDetailsClick}
                />
            </div>

            {/* Render Modals */}
            {modalType === 'assign' && selectedIncident && (
                <AssignVehicleModal
                    selectedIncident={selectedIncident}
                    availableVehicles={availableVehicles}
                    loadingVehicles={loadingVehicles}
                    onAssign={handleVehicleAssign}
                    onClose={closeModal}
                />
            )}

            {modalType === 'track' && selectedIncident && (
                <TrackIncidentModal
                    selectedIncident={selectedIncident}
                    onStatusUpdate={handleStatusUpdate}
                    onClose={closeModal}
                />
            )}

            {modalType === 'details' && selectedIncident && (
                <IncidentDetailsModal
                    selectedIncident={selectedIncident}
                    onAssignClick={() => {
                        closeModal();
                        handleAssignClick(selectedIncident);
                    }}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default IncidentsTable;