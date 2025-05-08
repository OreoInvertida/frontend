/**
 * FolderService - Service for single folder operations
 * Updated to handle a single folder approach where all documents are stored in one place
 */

import ApiService from './api-service.js';

export const FolderService = {  
  /**
   * Get all files in the main folder
   * @returns {Promise} - Promise resolving to files data
   */
  async getFiles() {
    return ApiService.get('/files');
  },
  
  /**
   * Upload a file to the main folder
   * @param {File} file - File to upload
   * @param {Object} metadata - Additional metadata for the file
   * @returns {Promise} - Promise resolving to the uploaded file data
   */
  async uploadFile(file, metadata = {}) {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata as JSON
    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    return ApiService.post('/files', formData, {
      // Don't set Content-Type header, it will be set automatically with boundary
      headers: {},
      // Don't stringify FormData
      body: formData
    });
  },
  
  /**
   * Delete a file
   * @param {string} fileId - ID of the file to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteFile(fileId) {
    return ApiService.delete(`/files/${fileId}`);
  },
  
  /**
   * Download a file
   * @param {string} fileId - ID of the file to download
   * @returns {Promise} - Promise resolving to file download URL or blob
   */
  async downloadFile(fileId) {
    // Get download URL or direct file data
    const result = await ApiService.get(`/files/${fileId}/download`);
    
    if (result.downloadUrl) {
      // If API returns a URL, use it
      return result.downloadUrl;
    } else {
      // Otherwise, we need to handle file download differently
      // This would typically be a blob response
      const response = await fetch(`${ApiService.baseUrl}/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      return await response.blob();
    }
  }
};

export default FolderService;