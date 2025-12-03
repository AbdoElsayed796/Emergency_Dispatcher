import { API_BASE_URL } from './config';

/**
 * Authentication Service
 * Handles user sign-in
 */
class LoginService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.userKey = 'currentUser';
  }

  /**
   * Sign-in user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: object}>} User data
   * @throws {Error} Authentication error
   */
  async signin(email, password) {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }

    try {
      const response = await fetch(`${this.baseURL}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Sign-in failed';
        throw new Error(errorMessage);
      }

      if (!data.user) {
        throw new Error('No user data received from server');
      }

      // Store user data in localStorage
      this.setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store user data in localStorage
   * @param {Object} user - User object
   */
  setUser(user) {
    if (!user) return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getUser();
  }

  /**
   * Sign out user
   */
  logout() {
    localStorage.removeItem(this.userKey);
  }

  /**
   * Get current user's role
   * @returns {string|null} User role or null
   */
  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check (DISPATCHER, RESPONDER, ADMIN)
   * @returns {boolean}
   */
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Check if user is dispatcher
   * @returns {boolean}
   */
  isDispatcher() {
    return this.hasRole('DISPATCHER');
  }

  /**
   * Check if user is responder
   * @returns {boolean}
   */
  isResponder() {
    return this.hasRole('RESPONDER');
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.hasRole('ADMIN');
  }
}

// Export singleton instance
export default new LoginService();