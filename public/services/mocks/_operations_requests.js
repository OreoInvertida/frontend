/**
 * Mock response for /operations/requests endpoint
 * Handles GET requests for incoming requests
 */

// In-memory storage for mock requests data
export const mockRequests = [
  { id: 'REQ001', type: 'Solicitud', document: 'Cédula', entityName: 'Registraduría Nacional', status: 'pending' },
  { id: 'REQ002', type: 'Recepción', document: 'Pasaporte', entityName: 'Cancillería', status: 'completed' },
  { id: 'REQ005', type: 'Recepción', document: 'Historia clínica', entityName: 'SURA EPS', status: 'completed' },
  { id: 'REQ003', type: 'Solicitud', document: 'Licencia', entityName: 'Ministerio de Transporte', status: 'failed' },
  { id: 'REQ004', type: 'Solicitud', document: 'Certificado', entityName: 'Cámara de Comercio', status: 'pending' }
];

export default function(options) {
  // Handle GET request to list requests
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      requests: [...mockRequests]
    };
  }
  
  // Handle POST request to create a new request
  if (options.method === 'POST') {
    try {
      // Parse request body
      const requestData = typeof options.body === 'string' 
        ? JSON.parse(options.body || '{}') 
        : (options.body || {});
      
      // Get required fields
      const requestType = requestData.requestType;
      const requestEntity = requestData.requestEntity;
      const requestNotes = requestData.requestNotes || '';
      
      if (!requestType || !requestEntity) {
        throw {
          status: 400,
          statusText: 'Bad Request',
          data: {
            success: false,
            message: 'Tipo de documento y entidad son requeridos'
          }
        };
      }
      
      // Create new request with generated ID
      const newRequest = {
        id: `REQ${Date.now().toString().slice(-6)}`,
        type: 'Solicitud',
        document: requestType.charAt(0).toUpperCase() + requestType.slice(1),
        entityName: requestEntity,
        status: 'pending'
      };
      
      // Add to mock data store
      mockRequests.unshift(newRequest);
      
      return {
        success: true,
        request: newRequest,
        message: 'Solicitud enviada correctamente'
      };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      throw {
        status: 500,
        statusText: 'Internal Server Error',
        data: {
          success: false,
          message: 'Error procesando la solicitud de documento'
        }
      };
    }
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations/requests endpoint`
    }
  };
}