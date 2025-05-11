/**
 * Mock response for /operations endpoint
 * Handles GET requests for outgoing operations
 */

// In-memory storage for mock operations data
export const mockOperations = [
  { 
    id: 'OP001',
    type: 'Solicitud',
    document: 'Cédula',
    entity: 'Registraduría Nacional',
    status: 'pending'
  },
  { 
    id: 'OP002',
    type: 'Recepción',
    document: 'Pasaporte',
    entity: 'Cancillería',
    status: 'completed'
  },
  { 
    id: 'OP003',
    type: 'Solicitud',
    document: 'Licencia',
    entity: 'Ministerio de Transporte',
    status: 'failed'
  },
  { 
    id: 'OP004',
    type: 'Solicitud',
    document: 'Certificado',
    entity: 'Cámara de Comercio',
    status: 'pending'
  }
];

export default function(options) {
  // Handle GET request to list operations
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      operations: [...mockOperations]
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operations endpoint`
    }
  };
}