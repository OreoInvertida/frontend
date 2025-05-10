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
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODAxNjI4Mzk5MSIsImV4cCI6MTc0NjkxMzg1OH0.A57cXfmAZq4pwaBMcSWkTsRpxIdnD781OIzoCDH3reE',
      token_type: 'bearer',
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