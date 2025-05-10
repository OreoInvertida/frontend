/**
 * Mock response for /operators/current endpoint
 * Provides information about the current operator
 */

export default function(options) {
  // Handle GET request to get current operator info
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      operator: {
        id: 'op1',
        name: 'OREO-FRONT',
        type: 'public',
        status: 'active',
        icon: 'building',
        since: '2023-01-15',
        stats: {
            documents: 154,
            requests: 23,
            entities: 12
        }
      }
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operators/current endpoint`
    }
  };
}