/**
 * Mock response for /auth/register endpoint
 */

export default function(options) {
  // Parse request data
  const userData = JSON.parse(options.body || '{}');
  
  // Check for required fields
  const requiredFields = ['first-name', 'first-lastname', 'document-type', 'document-number', 'email', 'password'];
  const missingFields = requiredFields.filter(field => !userData[field]);
  
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
  if (userData.email === 'existente@example.com') {
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
  if (userData['document-number'] === '987654321') {
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
      id: 'user-' + Date.now(),
      firstName: userData['first-name'],
      lastName: userData['first-lastname'],
      email: userData.email,
      documentType: userData['document-type'],
      documentNumber: userData['document-number']
    }
  };
}