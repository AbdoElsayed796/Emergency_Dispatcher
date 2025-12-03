import apiClient from '../api';
import { STATION_ENDPOINTS } from '../constants';

/**
 * Station Service
 * Handles all station-related API operations
 */
class StationService {
  /**
   * Get all stations
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    return await apiClient.get(STATION_ENDPOINTS.GET_ALL, { params });
  }

  /**
   * Get station by ID
   * @param {number} id - Station ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await apiClient.get(STATION_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get stations by type
   * @param {string} type - Station type (FIRE, POLICE, MEDICAL)
   * @returns {Promise<Array>}
   */
  async getByType(type) {
    return await apiClient.get(STATION_ENDPOINTS.GET_BY_TYPE(type));
  }

  /**
   * Get nearby stations
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Search radius in meters (default 5000)
   * @returns {Promise<Array>}
   */
  async getNearby(lat, lng, radius = 5000) {
    return await apiClient.get(STATION_ENDPOINTS.GET_NEARBY(lat, lng, radius));
  }

  /**
   * Create new station
   * @param {Object} stationData - Station data
   * @returns {Promise<Object>}
   */
  async create(stationData) {
    return await apiClient.post(STATION_ENDPOINTS.CREATE, stationData);
  }

  /**
   * Update station
   * @param {number} id - Station ID
   * @param {Object} stationData - Updated station data
   * @returns {Promise<Object>}
   */
  async update(id, stationData) {
    return await apiClient.put(STATION_ENDPOINTS.UPDATE(id), stationData);
  }

  /**
   * Delete station
   * @param {number} id - Station ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await apiClient.delete(STATION_ENDPOINTS.DELETE(id));
  }

  /**
   * Get fire stations
   * @returns {Promise<Array>}
   */
  async getFireStations() {
    return await this.getByType('FIRE');
  }

  /**
   * Get police stations
   * @returns {Promise<Array>}
   */
  async getPoliceStations() {
    return await this.getByType('POLICE');
  }

  /**
   * Get medical stations
   * @returns {Promise<Array>}
   */
  async getMedicalStations() {
    return await this.getByType('MEDICAL');
  }
}

export default new StationService();