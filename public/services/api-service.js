/**
 * ApiService - Core service for handling API requests
 * This service can be configured to use mock data or real API endpoints
 */

/**
 * Helper functions for common HTTP methods
 */
export const ApiService = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async get(endpoint, options = {}) {
    return fetch(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object|FormData} data - Data to send (object or FormData instance)
   * @param {Object} options - Additional request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async post(endpoint, data, options = {}) {
    const headers = { 'Content-Type': 'application/json' };

    console.log('ApiService.post - Endpoint received:', endpoint);

    return fetch(endpoint, {
      ...options,
      headers: { ...headers, ...options.headers },
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Data to send
   * @param {Object} options - Additional request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async put(endpoint, data, options = {}) {
    return fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async delete(endpoint, options = {}) {
    return fetch(endpoint, { ...options, method: 'DELETE' });
  }
};

export default ApiService;
