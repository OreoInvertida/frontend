/**
 * AuthService - Service for authentication-related operations
 */

import ApiService from './api-service.js';

export const AuthService = {
  /**
   * Login with credentials
   * @param {Object} credentials - User credentials (email and password)
   * @returns {Promise} - Promise resolving to login response
   */
  async login(credentials) {
    return ApiService.post('/auth/login', credentials);
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise} - Promise resolving to registration response
   */
  async register(userData) {
    return ApiService.post('/auth/register', userData);
  },
  
  /**
   * Logout current user
   * @returns {Promise} - Promise resolving when logout is complete
   */
  async logout() {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    // Call logout endpoint (useful for server-side session cleanup)
    try {
      await ApiService.post('/auth/logout', {});
    } catch (error) {
      console.log('Error during logout, but token was cleared', error);
    }
    
    return { success: true };
  },
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} - Whether the user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
  
  /**
   * Get the current authentication token
   * @returns {string|null} - The authentication token or null if not authenticated
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }
};

export default AuthService;