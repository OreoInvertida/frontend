import { 
    setupPasswordToggles, 
    setupPasswordValidation, 
    setupPasswordConfirmation,
    setupDocumentNumberValidation,
    setupEmailValidation,
    isValidPassword 
} from '../utilities/form-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const button = document.getElementById('signup-button');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const emailInput = document.getElementById('email');
    const documentNumberInput = document.getElementById('document-number');

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
        
        // Check if email is valid (using the HTML5 validation API)
        const isEmailValid = emailInput.validity.valid;
        
        // Enable button only if all conditions are met
        button.disabled = !(isFormValid && isPasswordValid && doPasswordsMatch && isEmailValid);
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
                
                // Store auth token if provided by the API
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                }
                
                // Show success message
                showSuccessMessage('¡Cuenta registrada exitosamente! Accediendo a tu carpeta...');
                
                // Redirect directly to folder page after a short delay
                setTimeout(() => {
                    window.location.href = 'folder-page.html';
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
 * @returns {Promise} - Promise that resolves with registration response
 */
async function registerUser(userData) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar usuario');
        }
        
        // Parse and return the response data
        return await response.json();
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
    // Check if success alert already exists
    let successAlert = document.querySelector('.signup-success');
    
    // If success alert doesn't exist, create it
    if (!successAlert) {
        successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success signup-success';
        successAlert.role = 'alert';
        
        // Get form and insert success alert before it
        const form = document.getElementById('signup-form');
        form.parentElement.insertBefore(successAlert, form);
    }
    
    // Update success message
    successAlert.textContent = message;
}

/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Check if error alert already exists
    let errorAlert = document.querySelector('.signup-error');
    
    // If error alert doesn't exist, create it
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger signup-error';
        errorAlert.role = 'alert';
        
        // Get form and insert error alert at the top
        const form = document.getElementById('signup-form');
        form.insertAdjacentElement('afterbegin', errorAlert);
    }
    
    // Update error message
    errorAlert.textContent = message;
    
    // Scroll to error message
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
}