/**
 * Mock response for /operators endpoint
 * Provides a list of available operators
 */

// In-memory storage for mock operators data
export const mockOperators = [
    {
        id: 'op1',
        name: 'OREO-FRONT',
        type: 'public',
        description: 'Operador principal de carpeta ciudadana',
        icon: 'building',
        capabilities: [
            { name: 'Documentos Personales', icon: 'file-earmark-person' },
            { name: 'Solicitudes Entidades Públicas', icon: 'bank' },
            { name: 'Compartir Documentos', icon: 'share' }
        ],
        stats: {
            users: '5,000,000+',
            documents: '25,000,000+',
            availability: '99.9%'
        },
        isCurrent: true
    },
    {
        id: 'op2',
        name: 'DocuCloud',
        type: 'private',
        description: 'Solución de gestión documental en la nube',
        icon: 'cloud',
        capabilities: [
            { name: 'Almacenamiento Ilimitado', icon: 'hdd' },
            { name: 'OCR y Búsqueda de Texto', icon: 'search' },
            { name: 'Firma Digital', icon: 'pen' }
        ],
        stats: {
            users: '2,100,000+',
            documents: '18,000,000+',
            availability: '99.8%'
        },
        isCurrent: false
    },
    {
        id: 'op3',
        name: 'GobDigital',
        type: 'public',
        description: 'Operador oficial del gobierno nacional',
        icon: 'bank',
        capabilities: [
            { name: 'Trámites Gubernamentales', icon: 'file-earmark-text' },
            { name: 'Certificados Oficiales', icon: 'award' },
            { name: 'Identificación Digital', icon: 'fingerprint' }
        ],
        stats: {
            users: '8,500,000+',
            documents: '40,000,000+',
            availability: '99.5%'
        },
        isCurrent: false
    },
    {
        id: 'op4',
        name: 'SecureVault',
        type: 'private',
        description: 'Protección de documentos con cifrado avanzado',
        icon: 'shield-lock',
        capabilities: [
            { name: 'Cifrado de Extremo a Extremo', icon: 'lock' },
            { name: 'Autenticación Multifactor', icon: 'shield-check' },
            { name: 'Acceso Biométrico', icon: 'fingerprint' }
        ],
        stats: {
            users: '1,200,000+',
            documents: '8,000,000+',
            availability: '99.95%'
        },
        isCurrent: false
    },
    {
        id: 'op5',
        name: 'DocuMed',
        type: 'private',
        description: 'Especializado en historias clínicas y documentos médicos',
        icon: 'hospital',
        capabilities: [
            { name: 'Historias Clínicas Digitales', icon: 'file-medical' },
            { name: 'Confidencialidad Médica', icon: 'shield-plus' },
            { name: 'Recetas Electrónicas', icon: 'prescription' }
        ],
        stats: {
            users: '800,000+',
            documents: '12,000,000+',
            availability: '97.5%'
        },
        isCurrent: false
    },
    {
        id: 'op6',
        name: 'EduDocs',
        type: 'public',
        description: 'Gestión documental para instituciones educativas',
        icon: 'mortarboard',
        capabilities: [
            { name: 'Certificados Académicos', icon: 'file-earmark-richtext' },
            { name: 'Expedientes Estudiantiles', icon: 'person-vcard' },
            { name: 'Títulos Digitales', icon: 'award' }
        ],
        stats: {
            users: '1,500,000+',
            documents: '9,000,000+',
            availability: '98.2%'
        },
        isCurrent: false
    }
];

export default function(options) {
  // Handle GET request to list operators
  if (!options.method || options.method === 'GET') {
    return {
      success: true,
      operators: [...mockOperators]
    };
  }
  
  // Handle unsupported methods
  throw {
    status: 405,
    statusText: 'Method Not Allowed',
    data: {
      success: false,
      message: `Method ${options.method} not supported for /operators endpoint`
    }
  };
}