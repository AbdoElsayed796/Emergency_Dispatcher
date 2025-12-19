import apiClient from '../api';
import { ASSIGNMENT_ENDPOINTS } from '../constants';

/**
 * Assignment Service
 * Handles all assignment-related API operations
 */
class AssignmentService {
  /**
   * Get all assignments
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    return await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_ALL, { params });
  }

  /**
   * Get assignment by ID
   * @param {number} id - Assignment ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get assignments by incident
   * @param {number} incidentId - Incident ID
   * @returns {Promise<Array>}
   */
  async getByIncident(incidentId) {
    return await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_BY_INCIDENT(incidentId));
  }

  /**
   * Get assignments by vehicle
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise<Array>}
   */
  async getByVehicle(vehicleId) {
    return await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_BY_VEHICLE(vehicleId));
  }

  /**
   * Get active assignments (not finished)
   * @returns {Promise<Array>}
   */
  async getActive() {
    return await apiClient.get(ASSIGNMENT_ENDPOINTS.GET_ACTIVE);
  }

  /**
   * Create new assignment (assign vehicle to incident)
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise<Object>}
   */
  async create(assignmentData) {
    return await apiClient.post(ASSIGNMENT_ENDPOINTS.CREATE, assignmentData);
  }

  /**
   * Update assignment
   * @param {number} id - Assignment ID
   * @param {Object} assignmentData - Updated assignment data
   * @returns {Promise<Object>}
   */
  async update(id, assignmentData) {
    return await apiClient.put(ASSIGNMENT_ENDPOINTS.UPDATE(id), assignmentData);
  }

  /**
   * Accept assignment (responder accepts the assignment)
   * @param {number} id - Assignment ID
   * @returns {Promise<Object>}
   */
  async accept(id) {
    return await apiClient.post(ASSIGNMENT_ENDPOINTS.ACCEPT(id));
  }

  /**
   * Complete assignment (mark as finished)
   * @param {number} id - Assignment ID
   * @returns {Promise<Object>}
   */
  async complete(id) {
    return await apiClient.post(ASSIGNMENT_ENDPOINTS.COMPLETE(id));
  }

  /**
   * Delete assignment
   * @param {number} id - Assignment ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await apiClient.delete(ASSIGNMENT_ENDPOINTS.DELETE(id));
  }

  /**
   * Assign vehicle to incident (convenience method)
   * @param {number} vehicleId - Vehicle ID
   * @param {number} incidentId - Incident ID
   * @param {number} dispatcherUserId - Dispatcher user ID
   * @returns {Promise<Object>}
   */
  async assignVehicleToIncident(vehicleId, incidentId, dispatcherUserId) {
    return await this.create({
        incidentId: incidentId,
        vehicleId: vehicleId,
        dispatcherId: dispatcherUserId,

    });
  }
}

export default new AssignmentService();