const constants = require('./utilities/constants')
const localStorage = require('./local_storage')

// Configuration
const API_CONFIG = {
  // Default request timeout in milliseconds
  timeout: 10000,

  // Default headers for all requests
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

/**
 * Make an API request
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options (method, body, headers, etc.)
 * @param {boolean} mockOverride - Override global mock setting for this request
 * @returns {Promise} - Promise resolving to the API response
 */
async function apiRequest(endpoint, options = {}) {
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
    const response = await fetch(constants.API_BASE_URL + endpoint, requestOptions);
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
        data: { message: `Request to ${endpoint} timed out after ${API_CONFIG.timeout}ms` }
      };
    }

    throw error;
  }
}

module.exports = apiRequest;

