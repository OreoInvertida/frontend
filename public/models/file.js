/**
 * File Model
 * A simple representation of a file/document object
 */

export class File {
  /**
   * Create a new File instance
   * @param {Object} data - Raw file data
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.path = data.path || '';
    this.isCertified = data.isCertified || false;
  }
  
  /**
   * Convert file to a plain object for API
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      isCertified: this.isCertified
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
      name: data.name || '',
      path: data.path || '',
      isCertified: data.isCertified || data.is_certified || false
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