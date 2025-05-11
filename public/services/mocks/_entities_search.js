/**
 * Mock response for /entities/search endpoint
 * Handles GET requests to search for entities
 */

// Mock entities for searching
export const mockEntities = [
  { id: 1, name: 'Registraduría Nacional', type: 'entity' },
  { id: 2, name: 'Cancillería', type: 'entity' },
  { id: 3, name: 'Ministerio de Transporte', type: 'entity' },
  { id: 4, name: 'Cámara de Comercio', type: 'entity' },
  { id: 5, name: 'SURA EPS', type: 'entity' },
  { id: 6, name: 'Juan Pérez', type: 'user' },
  { id: 7, name: 'María González', type: 'user' }
];

export default function(options) {
  // Handle GET request for entity search
  if (!options.method || options.method === 'GET') {
    // Parse query parameters to get search query
    const url = new URL(`http://example.com${options.url}`);
    const searchQuery = url.searchParams.get('q') || '';
    
    if (!searchQuery || searchQuery.length < 3) {
      return {
        success: true,
        entities: []
      };
    }
    
    // Filter entities based on search query
    const filteredEntities = mockEntities.filter(entity => 
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      success: true,
      entities: filteredEntities
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /entities/search endpoint`
    }
  };
}