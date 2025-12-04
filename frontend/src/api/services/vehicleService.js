import apiClient from '../api';
import { VEHICLE_ENDPOINTS } from '../constants';

/**
 * Vehicle Service
 * Handles all vehicle-related API operations
 */
class VehicleService {
  /**
   * Get all vehicles
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    return await apiClient.get(VEHICLE_ENDPOINTS.GET_ALL, { params });
  }

  /**
   * Get vehicle by ID
   * @param {number} id - Vehicle ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await apiClient.get(VEHICLE_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get vehicles by station
   * @param {number} stationId - Station ID
   * @returns {Promise<Array>}
   */
  async getByStation(stationId) {
    return await apiClient.get(VEHICLE_ENDPOINTS.GET_BY_STATION(stationId));
  }

  /**
   * Get vehicles by status
   * @param {string} status - Vehicle status (AVAILABLE, ON_ROUTE, BUSY, MAINTENANCE)
   * @returns {Promise<Array>}
   */
  async getByStatus(status) {
    return await apiClient.get(VEHICLE_ENDPOINTS.GET_BY_STATUS(status));
  }

  /**
   * Get available vehicles
   * @param {string} type - Optional vehicle type filter
   * @returns {Promise<Array>}
   */
  async getAvailable(type = null) {
    const params = type ? { type } : {};
    return await apiClient.get(VEHICLE_ENDPOINTS.GET_AVAILABLE, { params });
  }

  /**
   * Create new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise<Object>}
   */
  async create(vehicleData) {
    return await apiClient.post(VEHICLE_ENDPOINTS.CREATE, vehicleData);
  }

  /**
   * Update vehicle
   * @param {number} id - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise<Object>}
   */
  async update(id, vehicleData) {
    return await apiClient.put(VEHICLE_ENDPOINTS.UPDATE(id), vehicleData);
  }

  /**
   * Update vehicle status
   * @param {number} id - Vehicle ID
   * @param {string} status - New status
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    return await apiClient.patch(VEHICLE_ENDPOINTS.UPDATE_STATUS(id), { status });
  }

  /**
   * Update vehicle location
   * @param {number} id - Vehicle ID
   * @param {Object} location - {lat, lng}
   * @returns {Promise<Object>}
   */
  async updateLocation(id, location) {
    return await apiClient.patch(VEHICLE_ENDPOINTS.UPDATE_LOCATION(id), { location });
  }

  /**
   * Delete vehicle
   * @param {number} id - Vehicle ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await apiClient.delete(VEHICLE_ENDPOINTS.DELETE(id));
  }

  /**
   * Get available vehicles by type
   * @param {string} type - Vehicle type (FIRE, POLICE, MEDICAL)
   * @returns {Promise<Array>}
   */
  async getAvailableByType(type) {
    return await this.getAvailable(type);
  }

  async getAvailableVehicles() {
      return await apiClient.get(VEHICLE_ENDPOINTS.GET_AVAILABLE);
  }
}

export default new VehicleService();