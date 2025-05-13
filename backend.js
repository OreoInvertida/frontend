const constants = require('./utilities/constants')

// Configuration
const API_CONFIG = {
  // Default request timeout in milliseconds
  timeout: 10000,

  // Default headers for all requests
  defaultHeaders: {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json',
    'Accept': 'application/json',
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
    headers: {...API_CONFIG.defaultHeaders, ...options.headers},
    body: options.body,
  };

  if (options.body && typeof options.body === 'object') {
   delete requestOptions.headers['content-type']; 
  } 
  
  // Add auth token if available with the token_type
  const token = options.auth_token;
  const tokenType = options.token_type;
  if (token && tokenType) {
    requestOptions.headers['Authorization'] = `${tokenType} ${token}`;
  } else if (token) {
    // Fallback for backward compatibility
    requestOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(constants.API_BASE_URL + endpoint, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
    }

    return response;
  } catch (error) {
    // Handle abort error (timeout)
    if (error.name === 'AbortError') {
      throw {
        status: 500,
        statusText: 'Request timeout',
        data: { message: `Request to ${endpoint} timed out after ${API_CONFIG.timeout}ms` }
      };
    }

    throw error;
  }
}

module.exports = apiRequest;

