import apiClient from '../api.js';
import { NOTIFICATION_ENDPOINTS } from '../constants.js';

/**
 * Notification Service
 * Handles all notification-related API operations
 */
class NotificationService {
  /**
   * Fetch all notifications for a given role
   * @param {string} role - Role (DISPATCHER, ADMIN)
   * @returns {Promise<Array>}
   */
  async getByRole(role) {
    return await apiClient.get(NOTIFICATION_ENDPOINTS.GET_BY_ROLE(role));
  }

  /**
   * Mark a single notification as read
   * @param {number} id - Notification ID
   * @returns {Promise<void>}
   */
  async markAsRead(id) {
    return await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_AS_READ(id));
  }

  /**
   * Mark all notifications as read for a given role
   * @param {string} role - Role (DISPATCHER, ADMIN)
   * @returns {Promise<void>}
   */
  async markAllAsRead(role) {
    return await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ(role));
  }
}

export default new NotificationService();
