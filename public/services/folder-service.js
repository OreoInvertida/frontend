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
 * @param {FormData} formData - FormData containing file and name
 * @returns {Promise} - Promise resolving to the uploaded file data
 */
  // Add this method to your FolderService in folder-service.js
  async uploadFile(formData) {
      const userId = localStorage.getItem('user_id');
      const filename = formData.get('name');
      const file = formData.get('file');

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
          const response = await fetch(`/documents/doc/${userId}/${filename}`, {
              method: 'PUT',
              headers: {
                  'auth_token': localStorage.getItem('auth_token'),
                  'token_type': localStorage.getItem('token_type')
              },
              body: uploadFormData
          });
          
          const data = await response.json();
          
          if (!response.ok) {
              throw { status: response.status, data };
          }
          
          return {
              success: true,
              ...data
          };
      } catch (error) {
          console.error('Error uploading file:', error);
          return {
              success: false,
              message: error.data?.message || 'Error uploading file'
          };
      }
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
  async certifyFile(fileid, filename, filepath) {
    return ApiService.post(`/document/certify`, {
          document_id: fileid,
          document_name: filename,
          document_path: filepath
    }, {
      headers: {
        'auth_token': localStorage.getItem('auth_token'),
        'token_type': localStorage.getItem('token_type')
      }
    });
  }
};

export default FolderService;