/**
 * File Model
 * A simple representation of a file/document object
 */

export class File {
  /**
   * Possible file categories
   */
  static CATEGORIES = {
    HEALTH: 'health',
    EDUCATION: 'education',
    LABOUR: 'labour',
    LEGAL: 'legal',
    TRIBUTARY: 'tributary'
  };

  /**
   * Create a new File instance
   * @param {Object} data - Raw file data
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.documentTitle = data.documentTitle || '';
    this.url = data.url || '';
    this.isCertified = data.isCertified || false;
    this.category = this.validateCategory(data.category);
  }
  
  /**
   * Validate and normalize the category value
   * @param {string} category - The category value to validate
   * @returns {string} - A valid category value
   * @private
   */
  validateCategory(category) {
    const validCategories = Object.values(File.CATEGORIES);
    return category && validCategories.includes(category) 
      ? category 
      : null;
  }
  
  /**
   * Convert file to a plain object for API
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      documentTitle: this.documentTitle,
      url: this.url,
      isCertified: this.isCertified,
      category: this.category
    };
  }
  
  /**
   * Create a File instance from API data
   * @param {Object} data - Data from API
   * @returns {File} - New File instance
   */
  static fromAPI(data) {
    return new File({
      id: data.id,
      documentTitle: data.documentTitle || data.document_title || '',
      url: data.url || '',
      isCertified: data.isCertified || data.is_certified || false,
      category: data.category || ''
    });
  }
  
  /**
   * Create multiple File instances from API data
   * @param {Array} items - Array of file data objects from API
   * @returns {Array<File>} - Array of File instances
   */
  static fromAPIList(data) {
    const items = data.data || data;
    return Array.isArray(items) ? items.map(item => File.fromAPI(item)) : [];
  }
}

export default File;