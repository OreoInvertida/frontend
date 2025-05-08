/**
 * Mock response for /files endpoint
 * Handles both GET (list files) and POST (upload file) requests
 */

// In-memory storage for mock files
const mockFiles = [
  {
    id: 'file-001',
    documentTitle: 'Medical Certificate',
    url: 'https://example.com/files/medical-certificate.pdf',
    isCertified: true,
    category: 'health',
    name: 'medical-certificate.pdf',
    size: 1024000,
    mimeType: 'application/pdf',
    createdAt: '2025-04-15T10:30:00Z'
  },
  {
    id: 'file-002',
    documentTitle: 'University Degree',
    url: 'https://example.com/files/university-degree.jpg',
    isCertified: true,
    category: 'education',
    name: 'university-degree.jpg',
    size: 512000,
    mimeType: 'image/jpeg',
    createdAt: '2025-04-20T14:15:00Z'
  },
  {
    id: 'file-003',
    documentTitle: 'Work Contract',
    url: 'https://example.com/files/work-contract.pdf',
    isCertified: false,
    category: 'labour',
    name: 'work-contract.pdf',
    size: 756000,
    mimeType: 'application/pdf',
    createdAt: '2025-05-01T09:45:00Z'
  },
  {
    id: 'file-004',
    documentTitle: 'Legal Identification',
    url: 'https://example.com/files/legal-id.png',
    isCertified: true,
    category: 'legal',
    name: 'legal-id.png',
    size: 350000,
    mimeType: 'image/png',
    createdAt: '2025-05-05T11:20:00Z'
  },
  {
    id: 'file-005',
    documentTitle: 'Tax Declaration',
    url: 'https://example.com/files/tax-declaration.pdf',
    isCertified: false,
    category: 'tributary',
    name: 'tax-declaration.pdf',
    size: 890000,
    mimeType: 'application/pdf',
    createdAt: '2025-05-07T16:10:00Z'
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
    let fileCategory = '';
    let fileTitle = '';
    
    // Try to extract data from FormData if available
    if (options.body instanceof FormData) {
      const file = options.body.get('file');
      fileName = file?.name || `uploaded-file-${newFileId}.pdf`;
      fileCategory = options.body.get('category') || getRandomCategory();
      fileTitle = options.body.get('documentTitle') || `Document ${new Date().toLocaleDateString()}`;
    } else {
      // If not FormData, use default values
      fileName = `uploaded-file-${newFileId}.pdf`;
      fileCategory = getRandomCategory();
      fileTitle = `Document ${new Date().toLocaleDateString()}`;
    }
    
    // Infer mime type from file extension
    const mimeType = inferMimeType(fileName);
    
    // Create mock file object
    const newFile = {
      id: newFileId,
      documentTitle: fileTitle,
      url: `https://example.com/files/${fileName}`,
      isCertified: Math.random() > 0.5, // Randomly set certification
      category: fileCategory,
      name: fileName,
      size: Math.floor(Math.random() * 1000000) + 10000, // Random size between 10KB and 1MB
      mimeType: mimeType,
      createdAt: new Date().toISOString()
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

/**
 * Returns a random category from File.CATEGORIES
 * @returns {string} - A random valid category
 */
function getRandomCategory() {
  const categories = ['health', 'education', 'labour', 'legal', 'tributary'];
  return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Infers MIME type from file extension
 * @param {string} fileName - Name of the file
 * @returns {string} - MIME type
 */
function inferMimeType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}