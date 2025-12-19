import apiClient from '../api';
import { INCIDENT_ENDPOINTS } from '../constants';

/**
 * Incident Service
 * Handles all incident-related API operations
 */
class IncidentService {
  /**
   * Get all incidents
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_ALL, { params });
  }

  /**
   * Get incident by ID
   * @param {number} id - Incident ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get incidents by status
   * @param {string} status - Incident status (REPORTED, ASSIGNED, RESOLVED)
   * @returns {Promise<Array>}
   */
  async getByStatus(status) {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_BY_STATUS(status));
  }

  /**
   * Get incidents by severity
   * @param {string} severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
   * @returns {Promise<Array>}
   */
  async getBySeverity(severity) {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_BY_SEVERITY(severity));
  }

  /**
   * Get recent incidents
   * @param {number} limit - Number of incidents to return
   * @returns {Promise<Array>}
   */
  async getRecent(limit = 10) {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_RECENT, {
      params: { limit },
    });
  }

  /**
   * Get active incidents (REPORTED or ASSIGNED)
   * @returns {Promise<Array>}
   */
  async getActive() {
    return await apiClient.get(INCIDENT_ENDPOINTS.GET_ACTIVE);
  }

  /**
   * Create new incident
   * @param {Object} incidentData - Incident data
   * @returns {Promise<Object>}
   */
  async create(incidentData) {
    return await apiClient.post(INCIDENT_ENDPOINTS.CREATE, incidentData);
  }

  /**
   * Update incident
   * @param {number} id - Incident ID
   * @param {Object} incidentData - Updated incident data
   * @returns {Promise<Object>}
   */
  async update(id, incidentData) {
    return await apiClient.put(INCIDENT_ENDPOINTS.UPDATE(id), incidentData);
  }

  /**
   * Delete incident
   * @param {number} id - Incident ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await apiClient.delete(INCIDENT_ENDPOINTS.DELETE(id));
  }

  /**
   * Get reported incidents (not yet assigned)
   * @returns {Promise<Array>}
   */
  async getReported() {
    return await this.getByStatus('REPORTED');
  }

  /**
   * Get assigned incidents (vehicle dispatched)
   * @returns {Promise<Array>}
   */
  async getAssigned() {
    return await this.getByStatus('ASSIGNED');
  }

  /**
   * Get resolved incidents
   * @returns {Promise<Array>}
   */
  async getResolved() {
    return await this.getByStatus('RESOLVED');
  }

  /**
   * Get critical incidents
   * @returns {Promise<Array>}
   */
  async getCritical() {
    return await this.getBySeverity('CRITICAL');
  }

  async updateStatus(id, status) {
      return await apiClient.patch(INCIDENT_ENDPOINTS.UPDATE_STATUS(id), { status }.status);
  }
}

export default new IncidentService();