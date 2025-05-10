/**
 * Constants for API endpoints
 * Centralizes all API URLs used across the application
 */

// Base API URL
export const API_BASE_URL = 'http://34.49.117.57';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/orchestrator/register`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    LOGOUT: `${API_BASE_URL}/views/logout`
};

// Document request endpoints
export const REQUEST_ENDPOINTS = {
    CREATE: `${API_BASE_URL}/request-document/create`,
    MARK_COMPLETE: `${API_BASE_URL}/request-document/mark-complete`,
    GET: `${API_BASE_URL}/request-document/get`
};

// Document management endpoints
export const DOCUMENT_ENDPOINTS = {
    GET: `${API_BASE_URL}/documents/get`,
    UPLOAD: `${API_BASE_URL}/documents/upload`,
    TRANSFER: `${API_BASE_URL}/documents/transfer`,
    DOWNLOAD: `${API_BASE_URL}/documents/download`,
    DELETE: `${API_BASE_URL}/documents/delete`,
    CERTIFY: `${API_BASE_URL}/documents/certify`
};

// Operator management endpoints
export const OPERATOR_ENDPOINTS = {
    GET: `${API_BASE_URL}/operators/get`,
    TRANSFER_USER: `${API_BASE_URL}/operators/transfer-user`
};

// Operations endpoints
export const OPERATION_ENDPOINTS = {
    GET_INCOMING: `${API_BASE_URL}/operations/requests`,
    GET_OUTGOING: `${API_BASE_URL}/operations`,
    GET_DETAILS: `${API_BASE_URL}/operations`,
    RETRY_OPERATION: `${API_BASE_URL}/operations`,
    RETRY_REQUEST: `${API_BASE_URL}/operations/requests`,
    RECEIVE: `${API_BASE_URL}/operations/receive`,
    SEARCH_ENTITIES: `${API_BASE_URL}/entities/search`
};