/**
 * OperationsService - Service for operations-related functionality
 * Handles document requests, operations tracking, and related actions
 */

import ApiService from './api-service.js';
import { OPERATION_ENDPOINTS, API_BASE_URL } from '../utilities/constants.js';

export const OperationsService = {
  /**
   * Get incoming requests
   * @returns {Promise} - Promise resolving to incoming requests data
   */
  async getIncomingRequests() {
    const path = OPERATION_ENDPOINTS.GET_INCOMING.replace(API_BASE_URL, '');
    return ApiService.get(path);
  },
  
  /**
   * Get outgoing operations
   * @returns {Promise} - Promise resolving to outgoing operations data
   */
  async getOutgoingOperations() {
    const path = OPERATION_ENDPOINTS.GET_OUTGOING.replace(API_BASE_URL, '');
    return ApiService.get(path);
  },
  
  /**
   * Get operation details
   * @param {string} operationId - ID of the operation to get details for
   * @returns {Promise} - Promise resolving to operation details
   */
  async getOperationDetails(operationId) {
    const path = `${OPERATION_ENDPOINTS.GET_DETAILS.replace(API_BASE_URL, '')}/${operationId}`;
    return ApiService.get(path);
  },
  
  /**
   * Submit a document request
   * @param {Object} requestData - Request data including type, entity, notes
   * @returns {Promise} - Promise resolving to request submission result
   */
  async submitDocumentRequest(requestData) {
    const path = OPERATION_ENDPOINTS.GET_INCOMING.replace(API_BASE_URL, '');
    return ApiService.post(path, requestData);
  },
  
  /**
   * Confirm document receipt
   * @param {Object} receiptData - Receipt data including code and notes
   * @returns {Promise} - Promise resolving to receipt confirmation result
   */
  async confirmDocumentReceipt(receiptData) {
    const path = OPERATION_ENDPOINTS.RECEIVE.replace(API_BASE_URL, '');
    return ApiService.post(path, receiptData);
  },
  
  /**
   * Retry a failed operation
   * @param {string} operationId - ID of the operation to retry
   * @returns {Promise} - Promise resolving to retry result
   */
  async retryOperation(operationId) {
    const path = `${OPERATION_ENDPOINTS.RETRY_OPERATION.replace(API_BASE_URL, '')}/${operationId}/retry`;
    return ApiService.post(path, {});
  },
  
  /**
   * Retry a failed request
   * @param {string} requestId - ID of the request to retry
   * @returns {Promise} - Promise resolving to retry result
   */
  async retryRequest(requestId) {
    const path = `${OPERATION_ENDPOINTS.RETRY_REQUEST.replace(API_BASE_URL, '')}/${requestId}/retry`;
    return ApiService.post(path, {});
  },
  
  /**
   * Delete an operation
   * @param {string} operationId - ID of the operation to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteOperation(operationId) {
    const path = `${OPERATION_ENDPOINTS.GET_OUTGOING.replace(API_BASE_URL, '')}/${operationId}`;
    return ApiService.delete(path);
  },
  
  /**
   * Delete a request
   * @param {string} requestId - ID of the request to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteRequest(requestId) {
    const path = `${OPERATION_ENDPOINTS.GET_INCOMING.replace(API_BASE_URL, '')}/${requestId}`;
    return ApiService.delete(path);
  },
  
  /**
   * Search for entities
   * @param {string} query - Search query
   * @returns {Promise} - Promise resolving to entities search results
   */
  async searchEntities(query) {
    const path = `${OPERATION_ENDPOINTS.SEARCH_ENTITIES.replace(API_BASE_URL, '')}?q=${encodeURIComponent(query)}`;
    return ApiService.get(path);
  }
};

export default OperationsService;