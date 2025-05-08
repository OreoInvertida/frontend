/**
 * Mock response for /auth/login endpoint
 */

export default function(options) {
  // Parse request data
  const requestData = JSON.parse(options.body || '{}');
  const { idNumber, password } = requestData;

  // Mock successful login
  if (idNumber === '123456789' && password) {
    return {
      success: true,
      token: 'mock-jwt-token-for-testing-purposes-only',
      user: {
        name: 'Usuario Prueba',
        firstName: 'Usuario',
        lastName: 'Prueba',
        idNumber: '123456789',
        email: 'usuario@example.com'
      }
    };
  }

  // Mock login error - invalid credentials
  throw {
    status: 401,
    statusText: 'Unauthorized',
    data: {
      success: false,
      message: 'Credenciales inválidas. Por favor, verifica tus datos e intenta nuevamente.'
    }
  };
}