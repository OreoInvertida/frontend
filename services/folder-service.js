/**
 * FolderService - Service for single folder operations
 * Updated to handle a single folder approach where all documents are stored in one place
 */

import ApiService from './api-service.js';
import { default as AuthService } from './auth-service.js';
import { DOCUMENT_ENDPOINTS, API_BASE_URL } from '../utilities/constants.js';

export const FolderService = {  
  /**
   * Get all files in the main folder
   * @returns {Promise} - Promise resolving to files data
   */
  async getFiles() {
    try {
      // Get the user ID from localStorage directly as a fallback
      const userId = typeof AuthService.getUserId === 'function' ? AuthService.getUserId() : localStorage.getItem('user_id');
      
      if (!userId) {
        console.error('User ID not found. User might not be properly authenticated.');
        throw new Error('User authentication error');
      }
      
      // Replace {id} in the GET endpoint with the actual user ID
      const endpoint = DOCUMENT_ENDPOINTS.GET.replace('{id}', userId).replace(API_BASE_URL, '');
      console.log('Getting documents for user ID:', userId);
      console.log('Document endpoint:', endpoint);
      
      const response = await ApiService.get(endpoint);
      
      // Import the File model to convert API response
      const { default: File } = await import('../models/file.js');
      
      // Transform the API response to match our expected format
      return {
        success: true,
        files: File.fromAPIList(response)
      };
    } catch (error) {
      console.error('Error fetching files:', error);
      return {
        success: false,
        message: error.message || 'Error fetching documents'
      };
    }
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
  },
  
  /**
   * Certify a file
   * @param {string} fileId - ID of the file to certify
   * @param {string} name - Name of the document
   * @returns {Promise} - Promise resolving to certification result
   */
  async certifyFile(fileId, name) {
    return ApiService.post(`/files/${fileId}/certify`, {
      name: name
    });
  }
};

export default FolderService;