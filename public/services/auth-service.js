/**
 * AuthService - Service for authentication-related operations
 */

import ApiService from './api-service.js';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../utilities/constants.js';

export const AuthService = {
  /**
   * Login with credentials
   * @param {Object} credentials - User credentials (email and password)
   * @returns {Promise} - Promise resolving to login response
   */
  async login(credentials) {
    // Extract the path from the full URL
    const loginPath = AUTH_ENDPOINTS.LOGIN.replace(API_BASE_URL, '');
    return ApiService.post(loginPath, credentials);
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise} - Promise resolving to registration response
   */
  async register(userData) {
    // Extract the path from the full URL
    const registerPath = AUTH_ENDPOINTS.REGISTER
    console.log('AuthService.register - Full endpoint:', AUTH_ENDPOINTS.REGISTER);
    console.log('AuthService.register - Path after removing base URL:', registerPath);
    
    return ApiService.post(registerPath, userData);
  },
  
  /**
   * Logout current user
   * @returns {Promise} - Promise resolving when logout is complete
   */
  async logout() {
    // Clear tokens from sessionStorage
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token_type');
    sessionStorage.clear();
    
    // Call logout endpoint (useful for server-side session cleanup)
    try {
      const logoutPath = AUTH_ENDPOINTS.LOGOUT.replace(API_BASE_URL, '');
      await ApiService.post(logoutPath, {});
    } catch (error) {
      console.log('Error during logout, but tokens were cleared', error);
    }
    
    return { success: true };
  },
  
  /**
   * Change user password
   * @param {Object} passwordData - Object containing currentPassword and newPassword
   * @returns {Promise} - Promise resolving to change password response
   */
  async changePassword(passwordData) {
    const changePasswordPath = AUTH_ENDPOINTS.CHANGE_PASSWORD.replace(API_BASE_URL, '');
    return ApiService.post(changePasswordPath, passwordData);
  },
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} - Whether the user is authenticated
   */
  isAuthenticated() {
    return !!sessionStorage.getItem('auth_token');
  },
  
  /**
   * Get the current authentication token
   * @returns {string|null} - The authentication token or null if not authenticated
   */
  getToken() {
    return sessionStorage.getItem('auth_token');
  },
  
  /**
   * Get the token type
   * @returns {string|null} - The token type (e.g., 'bearer') or null if not authenticated
   */
  getTokenType() {
    return sessionStorage.getItem('token_type');
  },
  
  /**
   * Store authentication tokens
   * @param {Object} authData - Authentication data containing access_token and token_type
   */
  storeAuthTokens(authData) {
    if (authData.access_token) {
      sessionStorage.setItem('auth_token', authData.access_token);
    }
    
    if (authData.token_type) {
      sessionStorage.setItem('token_type', authData.token_type);
    }
  }
};

export default AuthService;