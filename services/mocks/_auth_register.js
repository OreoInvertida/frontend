/**
 * Mock response for /auth/register endpoint
 */

export default function(options) {
  // Parse request data
  const userData = JSON.parse(options.body || '{}');
  
  // Support both formats: hyphenated (from form) and camelCase (from JavaScript)
  const firstName = userData['first-name'] || userData.firstName || '';
  const firstLastname = userData['first-lastname'] || userData.firstLastname || '';
  const documentType = userData['document-type'] || userData.documentType || '';
  // Get document number from any of the possible property names
  const idNumber = userData['document-number'] || userData.documentNumber || userData.idNumber || '';
  const email = userData.email || '';
  const password = userData.password || '';
  
  // Check for required fields
  const missingFields = [];
  if (!firstName) missingFields.push('first-name');
  if (!firstLastname) missingFields.push('first-lastname');
  if (!documentType) missingFields.push('document-type');
  if (!idNumber) missingFields.push('document-number');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
  
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
  
  // Mock successful registration for all other cases
  return {
    success: true,
    message: 'Usuario registrado exitosamente',
    token: 'mock-jwt-token-for-testing-purposes-only',
    user: {
      firstName: firstName,
      lastName: firstLastname,
      email: email,
      documentType: documentType,
      idNumber: idNumber
    }
  };
}