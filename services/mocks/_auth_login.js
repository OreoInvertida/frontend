/**
 * Mock response for /auth/login endpoint
 */

export default function(options) {
  // Parse request data
  const requestData = JSON.parse(options.body || '{}');
  const { email, password } = requestData;

  // Mock successful login
  if (email === 'usuario@example.com' && password) {
    return {
      success: true,
      token: 'mock-jwt-token-for-testing-purposes-only',
      user: {
        name: 'Usuario Prueba',
        firstName: 'Usuario',
        lastName: 'Prueba',
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