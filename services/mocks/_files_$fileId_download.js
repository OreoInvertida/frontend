/**
 * Mock response for /files/{fileId}/download endpoint
 * Handles GET requests for downloading specific files
 */

// Mock file reference data
const fileReferences = {
  'file-001': {
    documentTitle: 'Medical Certificate',
    mimeType: 'application/pdf',
    name: 'medical-certificate.pdf'
  },
  'file-002': {
    documentTitle: 'University Degree',
    mimeType: 'image/jpeg',
    name: 'university-degree.jpg'
  },
  'file-003': {
    documentTitle: 'Work Contract',
    mimeType: 'application/pdf',
    name: 'work-contract.pdf'
  },
  'file-004': {
    documentTitle: 'Legal Identification',
    mimeType: 'image/png',
    name: 'legal-id.png'
  },
  'file-005': {
    documentTitle: 'Tax Declaration',
    mimeType: 'application/pdf',
    name: 'tax-declaration.pdf'
  }
};

export default function(options) {
  // Extract fileId from the endpoint
  // Endpoint pattern: /files/{fileId}/download
  const urlParts = options.url?.split('/') || [];
  const fileId = urlParts[urlParts.length - 2]; // -2 because the last part is "download"
  
  // Handle GET request to download a file
  if (!options.method || options.method === 'GET') {
    // Check if file exists in our reference data
    if (fileReferences[fileId] || fileId.startsWith('file-')) {
      const fileData = fileReferences[fileId] || {
        documentTitle: 'Generated Document',
        mimeType: 'application/pdf',
        name: `file-${fileId}.pdf`
      };
      
      // Generate a mock download URL that includes file name for realism
      const downloadUrl = `https://example.com/download/${fileId}/${fileData.name}?token=mock-token-${Date.now()}`;
      
      return {
        success: true,
        documentTitle: fileData.documentTitle,
        mimeType: fileData.mimeType,
        downloadUrl: downloadUrl
      };
    } else {
      // File doesn't exist
      throw {
        status: 404,
        statusText: 'Not Found',
        data: {
          success: false,
          message: `File with ID ${fileId} not found`
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
      message: `Method ${options.method} not supported for /files/${fileId}/download endpoint`
    }
  };
}