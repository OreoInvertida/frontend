/**
 * ApiService - Core service for handling API requests
 * This service can be configured to use mock data or real API endpoints
 */

// Configuration
const API_CONFIG = {
  // Base URL for API requests
  baseUrl: '/api',
  
  // Whether to use mock data instead of real API calls
  useMocks: true,
  
  // Default request timeout in milliseconds
  timeout: 10000,
  
  // Default headers for all requests
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};

/**
 * Make an API request
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options (method, body, headers, etc.)
 * @param {boolean} mockOverride - Override global mock setting for this request
 * @returns {Promise} - Promise resolving to the API response
 */
async function apiRequest(endpoint, options = {}, mockOverride = null) {
  const useMocks = mockOverride !== null ? mockOverride : API_CONFIG.useMocks;
  
  // If using mocks, try to get mock data
  if (useMocks) {
    try {
      const mockData = await import(`./mocks/${endpoint.replace(/\//g, '_')}.js`);
      console.log(`[MOCK] ${options.method || 'GET'} ${endpoint}`);
      
      // Simulate network delay for realistic testing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Handle different mock scenarios based on request
      const mockResponse = mockData.default(options);
      return mockResponse;
    } catch (error) {
      console.warn(`Mock data not found for ${endpoint}, falling back to API`);
      // If mock fails, fall back to real API call
    }
  }
  
  // Real API call
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const requestOptions = {
    method: options.method || 'GET',
    headers: { ...API_CONFIG.defaultHeaders, ...options.headers },
    ...options
  };
  
  // Add auth token if available with the token_type
  const token = localStorage.getItem('auth_token');
  const tokenType = localStorage.getItem('token_type');
  if (token && tokenType) {
    requestOptions.headers['Authorization'] = `${tokenType} ${token}`;
  } else if (token) {
    // Fallback for backward compatibility
    requestOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Create the request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  requestOptions.signal = controller.signal;
  
  try {
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
    }
    
    // Parse response as JSON (if possible)
    return await response.json().catch(() => ({}));
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort error (timeout)
    if (error.name === 'AbortError') {
      throw {
        status: 0,
        statusText: 'Request timeout',
        data: { message: `Request to ${url} timed out after ${API_CONFIG.timeout}ms` }
      };
    }
    
    throw error;
  }
}

/**
 * Helper functions for common HTTP methods
 */
export const ApiService = {
  /**
   * Configure API service
   * @param {Object} config - Configuration object
   */
  configure(config = {}) {
    Object.assign(API_CONFIG, config);
  },
  
  /**
   * Enable or disable mock mode
   * @param {boolean} enabled - Whether to enable mock mode
   */
  setMockMode(enabled) {
    API_CONFIG.useMocks = enabled;
    console.log(`Mock mode ${enabled ? 'enabled' : 'disabled'}`);
  },
  
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async get(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
  },
  
  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object|FormData} data - Data to send (object or FormData instance)
   * @param {Object} options - Additional request options
   * @returns {Promise} - Promise resolving to the API response
   */
  async post(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    const headers = isFormData 
      ? {} // Don't set Content-Type for FormData, let the browser set it with boundary
      : { 'Content-Type': 'application/json' };
    
    return apiRequest(endpoint, {
      ...options,
      headers: { ...headers, ...options.headers },
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data)
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
    return apiRequest(endpoint, {
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
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
  }
};

export default ApiService;