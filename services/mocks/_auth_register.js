/**
 * Mock response for /auth/register endpoint
 */

export default function(options) {
  // Check if we're dealing with FormData (multipart/form-data)
  const isFormData = options.body instanceof FormData || 
    (options.headers && 
     options.headers['Content-Type'] && 
     options.headers['Content-Type'].includes('multipart/form-data'));
  
  let userData;
  
  if (isFormData) {
    // For FormData requests, we can't directly parse FormData in the mock
    // So we'll simulate by creating default test data
    userData = createMockFormData(options.body);
  } else {
    // Fallback to JSON parsing for backward compatibility
    try {
      userData = JSON.parse(options.body || '{}');
    } catch (e) {
      userData = {};
    }
  }
  
  // Get fields from the expected format
  const idNumber = userData.id_number || '';
  const name = userData.name || '';
  const email = userData.email || '';
  const address = userData.address || '';
  const password = userData.password || '';
  const idDocumentFile = userData.id_document_file || null;
  
  // Check for required fields
  const missingFields = [];
  if (!idNumber) missingFields.push('id_number');
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!address) missingFields.push('address');
  if (!password) missingFields.push('password');
  if (!idDocumentFile) missingFields.push('id_document_file');
  
  if (missingFields.length > 0) {
    throw {
      status: 400,
      statusText: 'Bad Request',
      data: {
        success: false,
        message: 'Faltan campos requeridos: ' + missingFields.join(', ')
      }
    };
  }
  
  // Check file size if present (simulate file size check)
  if (idDocumentFile && idDocumentFile.size > 1024 * 1024) {
    throw {
      status: 400,
      statusText: 'Bad Request',
      data: {
        success: false,
        message: 'El documento de identidad debe tener un tamaño máximo de 1MB'
      }
    };
  }
  
  // Mock email already exists error for specific test email
  if (email === 'existente@example.com') {
    throw {
      status: 409,
      statusText: 'Conflict',
      data: {
        success: false,
        message: 'Ya existe un usuario registrado con este correo electrónico'
      }
    };
  }
  
  // Mock document number already exists error for specific test document
  if (idNumber === '987654321') {
    throw {
      status: 409,
      statusText: 'Conflict',
      data: {
        success: false,
        message: 'Ya existe un usuario registrado con este número de documento'
      }
    };
  }
  
  // Extract first name and last name from the full name
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const firstLastname = nameParts.length > 2 ? nameParts[2] : (nameParts.length > 1 ? nameParts[1] : '');
  
  // Mock successful registration
  return {
    success: true,
    message: 'Usuario registrado exitosamente',
    token: 'mock-jwt-token-for-testing-purposes-only',
    user: {
      firstName: firstName,
      lastName: firstLastname,
      email: email,
      idNumber: idNumber,
      address: address
    }
  };
}

/**
 * Helper function to create mock form data
 * @param {FormData|string} formData - The form data object or string
 * @returns {object} - Parsed form data as an object
 */
function createMockFormData(formData) {
  // Create default test data
  const result = {
    id_number: '123456789',
    name: 'Juan Carlos Pérez Rodríguez',
    email: 'juanperez@example.com',
    address: 'Calle 123 #45-67, Bogotá, Cundinamarca',
    password: 'Password123!',
    id_document_file: { size: 500 * 1024, name: 'cedula.pdf' } // 500KB
  };
  
  // If we have FormData or a string representing it, try to extract some info for test cases
  if (formData) {
    // Convert FormData to string if it's FormData object
    const formDataString = typeof formData === 'string' 
      ? formData 
      : formData.toString();
    
    // Check for test cases
    if (formDataString.includes('existente@example.com')) {
      result.email = 'existente@example.com';
    }
    
    if (formDataString.includes('987654321')) {
      result.id_number = '987654321';
    }
    
    if (formDataString.includes('oversized-file')) {
      result.id_document_file = { size: 1.5 * 1024 * 1024, name: 'cedula.pdf' }; // 1.5MB
    }
  }
  
  return result;
}