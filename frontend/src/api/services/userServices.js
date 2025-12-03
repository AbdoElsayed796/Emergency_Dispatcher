import apiClient from '../api';
import { USER_ENDPOINTS } from '../constants';

/**
 * User Service
 * Handles all user-related API operations
 */
class UserService {
  /**
   * Get all users
   * @param {Object} params - Query parameters (page, size, `role, etc.)
   * @returns {Promise<Array>}
   */
  async getAll(params = {}) {
    return await apiClient.get(USER_ENDPOINTS.GET_ALL, {
      params,
    });
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await apiClient.get(USER_ENDPOINTS.GET_BY_ID(id));
  }

  /**
   * Get users by role
   * @param {string} role - User role (DISPATCHER, RESPONDER, ADMIN)
   * @returns {Promise<Array>}
   */
  async getByRole(role) {
    return await apiClient.get(USER_ENDPOINTS.GET_BY_ROLE(role));
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async create(userData) {
    return await apiClient.post(USER_ENDPOINTS.CREATE, userData);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>}
   */
  async update(id, userData) {
    return await apiClient.put(USER_ENDPOINTS.UPDATE(id), userData);
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await apiClient.delete(USER_ENDPOINTS.DELETE(id));
  }

  /**
   * Get all dispatchers
   * @returns {Promise<Array>}
   */
  async getDispatchers() {
    return await this.getByRole('DISPATCHER');
  }

  /**
   * Get all responders
   * @returns {Promise<Array>}
   */
  async getResponders() {
    return await this.getByRole('RESPONDER');
  }
}

export default new UserService();