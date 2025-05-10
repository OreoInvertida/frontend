/**
 * Mock response for /files endpoint
 * Handles both GET (list files) and POST (upload file) requests
 */

// In-memory storage for mock files - exported for use in other mocks
export const mockFiles = [
  {
    id: 'file-001',
    name: 'medical-certificate.pdf',
    path: '/documents/medical-certificate.pdf',
    isCertified: true
  },
  {
    id: 'file-002',
    name: 'university-degree.jpg',
    path: '/documents/university-degree.jpg',
    isCertified: true
  },
  {
    id: 'file-003',
    name: 'work-contract.pdf',
    path: '/documents/work-contract.pdf',
    isCertified: false
  },
  {
    id: 'file-004',
    name: 'legal-id.png',
    path: '/documents/legal-id.png',
    isCertified: true
  },
  {
    id: 'file-005',
    name: 'tax-declaration.pdf',
    path: '/documents/tax-declaration.pdf',
    isCertified: false
  },
  {
    id: 'file-006',
    name: 'medical-certificate.pdf',
    path: '/documents/medical-certificate.pdf',
    isCertified: true
  },
  {
    id: 'file-007',
    name: 'university-degree.jpg',
    path: '/documents/university-degree.jpg',
    isCertified: true
  },
  {
    id: 'file-008',
    name: 'work-contract.pdf',
    path: '/documents/work-contract.pdf',
    isCertified: false
  },
  {
    id: 'file-009',
    name: 'legal-id.png',
    path: '/documents/legal-id.png',
    isCertified: true
  },
  {
    id: 'file-010',
    name: 'tax-declaration.pdf',
    path: '/documents/tax-declaration.pdf',
    isCertified: false
  }
];

export default function(options) {
  // Handle GET request to list files
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      files: [...mockFiles]
    };
  }
  
  // Handle POST request to upload a file
  if (options.method === 'POST') {
    // Extract file data (in a real implementation, this would parse the FormData)
    const newFileId = `file-${Date.now().toString().slice(-6)}`;
    let fileName = '';
    
    // Try to extract data from FormData if available
    if (options.body instanceof FormData) {
      const file = options.body.get('file');
      fileName = file?.name || `uploaded-file-${newFileId}.pdf`;
    } else {
      // If not FormData, use default values
      fileName = `uploaded-file-${newFileId}.pdf`;
    }
    
    // Create mock file object with simplified structure
    const newFile = {
      id: newFileId,
      name: fileName,
      path: `/documents/${fileName}`,
      isCertified: false
    };
    
    // Add to mock data store
    mockFiles.push(newFile);
    
    return {
      success: true,
      file: newFile,
      message: 'File uploaded successfully'
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /files endpoint`
    }
  };
}