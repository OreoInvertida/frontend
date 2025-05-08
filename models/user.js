/**
 * User Model
 * A simple representation of a user object
 */

export class User {
  /**
   * Create a new User instance
   * @param {Object} data - Raw user data
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.address = data.address || '';
    this.password = data.password; // Only used during creation, not stored long-term
  }
  
  /**
   * Convert user to a plain object for API
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    const json = {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address
    };
    
    // Only include password when it exists (for registration)
    if (this.password) {
      json.password = this.password;
    }
    
    return json;
  }
  
  /**
   * Create a User instance from API data
   * @param {Object} data - Data from API
   * @returns {User} - New User instance
   */
  static fromAPI(data) {
    return new User({
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      address: data.address || ''
    });
  }
}

export default User;