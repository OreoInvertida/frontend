import { 
    setupPasswordToggles, 
    setupPasswordValidation, 
    setupPasswordConfirmation,
    setupDocumentNumberValidation,
    setupEmailValidation,
    isValidPassword 
} from '../utilities/form-utils.js';

import AuthService from '../services/auth-service.js';
import { AUTH_ENDPOINTS } from '../utilities/constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const button = document.getElementById('register-button');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const emailInput = document.getElementById('email');
    const documentNumberInput = document.getElementById('document-number');
    const fileInput = document.getElementById('identity-document');
    const fileSizeFeedback = document.getElementById('file-size-feedback');

    // Setup password toggle functionality using shared utility
    setupPasswordToggles();
    
    // Setup password validation with requirements feedback
    setupPasswordValidation('password');
    
    // Setup password confirmation validation
    setupPasswordConfirmation('password', 'confirm-password');
    
    // Setup document number validation
    setupDocumentNumberValidation('document-number');
    
    // Setup email validation
    setupEmailValidation('email');
    

    // Form validation
    form.addEventListener('input', () => {
        // Check if the form is valid and password meets criteria
        const isFormValid = form.checkValidity();
        const isPasswordValid = passwordInput.value ? isValidPassword(passwordInput.value) : false;
        const doPasswordsMatch = confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value !== '';
        const isEmailValid = emailInput.validity.valid;
        
        // Check if file is valid (if selected)
        const isFileValid = !fileInput.dataset.sizeError;
        
        // Enable button only if all conditions are met
        button.disabled = !(isFormValid && isPasswordValid && doPasswordsMatch && isEmailValid && isFileValid);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
        
        // Get form data and encrypt sensitive information
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        
        // Encrypt sensitive data (password)
        const encryptedData = encryptSensitiveData(userData);
        
        // Send registration request
        registerUser(encryptedData)
            .then(response => {
                // Handle successful registration
                console.log('Registration successful', response);
                console.log('User registered successfully with:', response.access_token);
                // Store auth token if provided by the API
                if (response.token) {
                    sessionStorage.setItem('auth_token', response.access_token);
                    sessionStorage.setItem('token_type', response.token_type);
                    sessionStorage.setItem('user_id',  encryptedData['document-number']);
                }
                //print('User registered successfully with:', response.token);
                
                // Show success message
                showSuccessMessage('¡Cuenta registrada exitosamente! Accediendo a tu carpeta...');
                
                // Redirect directly to folder page after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            })
            .catch(error => {
                // Handle registration error
                console.error('Registration failed', error);
                
                // Show error message
                showErrorMessage(error.message || 'Hubo un error al registrar la cuenta. Por favor, intenta nuevamente.');
            })
            .finally(() => {
                // Reset button state
                button.disabled = false;
                button.innerHTML = 'Registrar cuenta';
            });
    });
});

/**
 * Encrypt sensitive data (password) before sending to server
 * @param {Object} userData - User data from form
 * @returns {Object} - User data with encrypted sensitive fields
 */
function encryptSensitiveData(userData) {
    // Create a deep copy of the userData object
    const encryptedData = { ...userData };
    
    // Remove the confirm-password field as it's not needed for the API
    delete encryptedData['confirm-password'];
    
    // Encrypt the password field (you could implement actual encryption here)
    // For real implementation, use a library like CryptoJS or Web Crypto API
    
    // Method 1: Using Base64 encoding (not real encryption, just an example)
    // encryptedData.password = btoa(userData.password);
    
    // Method 2: In a real implementation, you might use something like:
    // encryptedData.password = CryptoJS.AES.encrypt(userData.password, 'your-secret-key').toString();
    
    // For now, we'll leave the password as is since the backend will handle proper encryption
    // and we're sending over HTTPS
    
    return encryptedData;
}

/**
 * Send registration request to the server
 * @param {Object} userData - User data to register
 * @returns {Promise} - Promise resolving with registration response
 */
async function registerUser(userData) {
    try {
        // Format the data as required by the API
        const formData = new FormData();
        
        // Create a data object according to the expected API format
        const dataObject = {
            user_id: userData['document-number'],
            name: [
                userData['first-name'] || '',
                userData['second-name'] || '',
                userData['first-lastname'] || '',
                userData['second-lastname'] || ''
            ].filter(part => part.trim()).join(' '),
            email: userData.email,
            address: [
                userData.address || '',
                userData.city || '',
                userData.department || ''
            ].filter(part => part.trim()).join(', '),
            password: userData.password
        };

        
        // Append the data object as JSON
        formData.append('data', JSON.stringify(dataObject));

        // Get the file from the form
        const fileInput = document.getElementById('identity-document');
        const file = fileInput.files[0];
        
        
        // Add file to form data if it exists
        if (file) {
            formData.append('document', file);
        } else {
            throw new Error('El documento de identidad es requerido');
        }
        
        // Log the API endpoint for debugging
        console.log('Registering user with AuthService');
        console.log('REGISTER endpoint from constants:', AUTH_ENDPOINTS.REGISTER);
        
        // Use AuthService to send the request
        return await AuthService.register(formData);
    } catch (error) {
        console.error('Registration request failed:', error);
        throw error;
    }
}

/**
 * Show success message to the user
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    const button = document.getElementById('register-button');
    
    // Change button appearance to success state
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>' + message;
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('.register-error');
    
    // If error alert doesn't exist, create it
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger register-error';
        errorAlert.role = 'alert';
        
        // Get form and insert error alert at the top
        const form = document.getElementById('register-form');
        form.insertAdjacentElement('afterbegin', errorAlert);
    }
    
    // Update error message
    errorAlert.textContent = message;
    
    // Scroll to error message
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Set up file size validation
 * @param {HTMLElement} fileInput - File input element
 * @param {HTMLElement} feedbackElement - Element to show validation feedback
 * @param {number} maxSize - Maximum file size in bytes
 */
function setupFileSizeValidation(fileInput, feedbackElement, maxSize) {
    if (!fileInput || !feedbackElement) return;
    
    fileInput.addEventListener('change', function() {
        // Reset previous validation
        fileInput.classList.remove('is-invalid');
        delete fileInput.dataset.sizeError;
        
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // Check if file size exceeds the maximum
            if (file.size > maxSize) {
                // Show error
                fileInput.classList.add('is-invalid');
                feedbackElement.textContent = `El archivo excede el tamaño máximo de ${Math.round(maxSize/1024/1024)}MB (tamaño actual: ${(file.size/1024/1024).toFixed(2)}MB)`;
                fileInput.dataset.sizeError = 'true';
            } else {
                // File size is valid
                fileInput.classList.add('is-valid');
            }
        }
        
        // Trigger form validation check
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
}