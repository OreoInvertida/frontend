/**
 * OperatorService - Service for operator-related operations
 * Handles operator listing, details, and transfer requests
 */

import ApiService from './api-service.js';

export const OperatorService = {
  /**
   * Get all available operators
   * @returns {Promise} - Promise resolving to operators data
   */
  async getOperators() {
    return ApiService.get('/operators');
  },
  
  /**
   * Get current operator information
   * @returns {Promise} - Promise resolving to current operator data
   */
  async getCurrentOperator() {
    return ApiService.get('/operators/current');
  },
  
  /**
   * Get transfer history
   * @returns {Promise} - Promise resolving to transfer history data
   */
  async getTransferHistory() {
    return ApiService.get('/operators/transfers');
  },
  
  /**
   * Request a transfer to another operator
   * @param {string} operatorId - ID of the target operator
   * @returns {Promise} - Promise resolving to transfer request result
   */
  async requestTransfer(operatorId) {
    return ApiService.post('/operators/transfers', {
      targetOperatorId: operatorId
    });
  }
};

export default OperatorService;