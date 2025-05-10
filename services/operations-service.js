/**
 * OperationsService - Service for operations-related functionality
 * Handles document requests, operations tracking, and related actions
 */

import ApiService from './api-service.js';

export const OperationsService = {
  /**
   * Get incoming requests
   * @returns {Promise} - Promise resolving to incoming requests data
   */
  async getIncomingRequests() {
    return ApiService.get('/operations/requests');
  },
  
  /**
   * Get outgoing operations
   * @returns {Promise} - Promise resolving to outgoing operations data
   */
  async getOutgoingOperations() {
    return ApiService.get('/operations');
  },
  
  /**
   * Get operation details
   * @param {string} operationId - ID of the operation to get details for
   * @returns {Promise} - Promise resolving to operation details
   */
  async getOperationDetails(operationId) {
    return ApiService.get(`/operations/${operationId}`);
  },
  
  /**
   * Submit a document request
   * @param {Object} requestData - Request data including type, entity, notes
   * @returns {Promise} - Promise resolving to request submission result
   */
  async submitDocumentRequest(requestData) {
    return ApiService.post('/operations/requests', requestData);
  },
  
  /**
   * Confirm document receipt
   * @param {Object} receiptData - Receipt data including code and notes
   * @returns {Promise} - Promise resolving to receipt confirmation result
   */
  async confirmDocumentReceipt(receiptData) {
    return ApiService.post('/operations/receive', receiptData);
  },
  
  /**
   * Retry a failed operation
   * @param {string} operationId - ID of the operation to retry
   * @returns {Promise} - Promise resolving to retry result
   */
  async retryOperation(operationId) {
    return ApiService.post(`/operations/${operationId}/retry`, {});
  },
  
  /**
   * Retry a failed request
   * @param {string} requestId - ID of the request to retry
   * @returns {Promise} - Promise resolving to retry result
   */
  async retryRequest(requestId) {
    return ApiService.post(`/operations/requests/${requestId}/retry`, {});
  },
  
  /**
   * Delete an operation
   * @param {string} operationId - ID of the operation to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteOperation(operationId) {
    return ApiService.delete(`/operations/${operationId}`);
  },
  
  /**
   * Delete a request
   * @param {string} requestId - ID of the request to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteRequest(requestId) {
    return ApiService.delete(`/operations/requests/${requestId}`);
  },
  
  /**
   * Search for entities
   * @param {string} query - Search query
   * @returns {Promise} - Promise resolving to entities search results
   */
  async searchEntities(query) {
    return ApiService.get(`/entities/search?q=${encodeURIComponent(query)}`);
  }
};

export default OperationsService;