/**
 * Form Utilities
 * Contains utility functions for form interactions and behaviors
 */

/**
 * Password validation criteria
 */
const PASSWORD_CRITERIA = {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSpecial: true
};

/**
 * Password validation patterns
 */
const PASSWORD_PATTERNS = {
    minLength: (password) => password.length >= PASSWORD_CRITERIA.minLength,
    hasUppercase: (password) => /[A-Z]/.test(password),
    hasLowercase: (password) => /[a-z]/.test(password),
    hasNumber: (password) => /[0-9]/.test(password),
    hasSpecial: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
};

/**
 * Password validation messages
 */
const PASSWORD_MESSAGES = {
    minLength: `Al menos ${PASSWORD_CRITERIA.minLength} caracteres`,
    hasUppercase: 'Al menos una letra mayúscula',
    hasLowercase: 'Al menos una letra minúscula',
    hasNumber: 'Al menos un número',
    hasSpecial: 'Al menos un carácter especial (!@#$%^&*)'
};

/**
 * Setup password visibility toggle for a single password field
 * @param {HTMLElement} toggleButton - The button element that toggles password visibility
 */
function setupSinglePasswordToggle(toggleButton) {
    if (!toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const passwordInput = this.previousElementSibling || document.getElementById(this.getAttribute('data-for'));
        if (!passwordInput) return;
        
        const eyeIcon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('bi-eye');
            eyeIcon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('bi-eye-slash');
            eyeIcon.classList.add('bi-eye');
        }
    });
}

/**
 * Setup password visibility toggle for a single password field by selector
 * @param {string} selector - CSS selector for the toggle button
 */
function setupPasswordToggle(selector = '.toggle-password') {
    const toggleButton = document.querySelector(selector);
    setupSinglePasswordToggle(toggleButton);
}

/**
 * Setup password visibility toggles for multiple password fields
 * @param {string} selector - CSS selector for the toggle buttons
 */
function setupPasswordToggles(selector = '.toggle-password') {
    document.querySelectorAll(selector).forEach(button => {
        setupSinglePasswordToggle(button);
    });
}

/**
 * Validate a password against all criteria
 * @param {string} password - The password to validate
 * @returns {Object} - Validation results for each criterion
 */
function validatePassword(password) {
    const results = {};
    
    for (const criterion in PASSWORD_PATTERNS) {
        results[criterion] = PASSWORD_PATTERNS[criterion](password);
    }
    
    return results;
}

/**
 * Check if a password passes all validation criteria
 * @param {string} password - The password to validate
 * @returns {boolean} - True if the password passes all criteria
 */
function isValidPassword(password) {
    const results = validatePassword(password);
    return Object.values(results).every(result => result === true);
}

/**
 * Create password requirements hint element
 * @param {string} inputId - ID of the password input field
 * @returns {HTMLElement} - The requirements container element
 */
function createPasswordRequirements(inputId) {
    const requirementsId = `${inputId}-requirements`;
    let requirementsContainer = document.getElementById(requirementsId);
    
    // If requirements element already exists, return it
    if (requirementsContainer) {
        return requirementsContainer;
    }
    
    // Create requirements container
    requirementsContainer = document.createElement('div');
    requirementsContainer.id = requirementsId;
    requirementsContainer.className = 'password-requirements text-muted small mt-2 shadow-sm rounded p-3 position-absolute bg-white';
    requirementsContainer.innerHTML = '<p class="mb-1 fw-bold">La contraseña debe tener:</p>';
    requirementsContainer.style.display = 'none'; // Hide by default
    requirementsContainer.style.zIndex = '100';
    requirementsContainer.style.width = '300px';
    requirementsContainer.style.border = '1px solid #dee2e6';
    
    // Create requirements list
    const requirementsList = document.createElement('ul');
    requirementsList.className = 'ps-3 mb-0';
    
    // Add each requirement to the list
    for (const criterion in PASSWORD_MESSAGES) {
        const item = document.createElement('li');
        item.dataset.criterion = criterion;
        item.textContent = PASSWORD_MESSAGES[criterion];
        requirementsList.appendChild(item);
    }
    
    requirementsContainer.appendChild(requirementsList);
    return requirementsContainer;
}

/**
 * Setup password validation for a password field
 * @param {string} inputId - ID of the password input field
 */
function setupPasswordValidation(inputId) {
    const passwordInput = document.getElementById(inputId);
    if (!passwordInput) return;
    
    // Create requirements element if it doesn't exist
    const requirementsContainer = createPasswordRequirements(inputId);
    
    // Add requirements after the input group
    const inputGroup = passwordInput.closest('.input-group') || passwordInput.parentElement;
    inputGroup.style.position = 'relative';
    inputGroup.insertAdjacentElement('afterend', requirementsContainer);
    
    // Show requirements when input is focused
    passwordInput.addEventListener('focus', function() {
        requirementsContainer.style.display = 'block';
    });
    
    // Optional: Hide requirements when clicking outside
    document.addEventListener('click', function(event) {
        if (!passwordInput.contains(event.target) && 
            !requirementsContainer.contains(event.target) &&
            !event.target.classList.contains('toggle-password')) {
            requirementsContainer.style.display = 'none';
        }
    });
    
    // Setup validation on input
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const validationResults = validatePassword(password);
        
        // Show requirements container if there's any input
        if (password.length > 0) {
            requirementsContainer.style.display = 'block';
        }
        
        // Update visual feedback for each requirement
        for (const criterion in validationResults) {
            const requirementItem = requirementsContainer.querySelector(`[data-criterion="${criterion}"]`);
            if (requirementItem) {
                if (validationResults[criterion]) {
                    requirementItem.classList.add('text-success');
                    requirementItem.classList.remove('text-danger');
                    requirementItem.innerHTML = `<i class="bi bi-check-circle"></i> ${PASSWORD_MESSAGES[criterion]}`;
                } else {
                    requirementItem.classList.add('text-danger');
                    requirementItem.classList.remove('text-success');
                    requirementItem.innerHTML = `<i class="bi bi-x-circle"></i> ${PASSWORD_MESSAGES[criterion]}`;
                }
            }
        }
    });
}

/**
 * Setup password confirmation validation
 * @param {string} passwordId - ID of the original password field
 * @param {string} confirmId - ID of the confirmation password field
 */
function setupPasswordConfirmation(passwordId, confirmId) {
    const passwordInput = document.getElementById(passwordId);
    const confirmInput = document.getElementById(confirmId);
    
    if (!passwordInput || !confirmInput) return;
    
    // Create feedback element
    const feedbackId = `${confirmId}-feedback`;
    let feedbackElement = document.getElementById(feedbackId);
    
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.id = feedbackId;
        feedbackElement.className = 'invalid-feedback';
        feedbackElement.textContent = 'Las contraseñas no coinciden';
        
        const inputGroup = confirmInput.closest('.input-group') || confirmInput.parentElement;
        inputGroup.insertAdjacentElement('afterend', feedbackElement);
    }
    
    // Setup validation for confirmation field
    confirmInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmation = this.value;
        
        if (confirmation && password !== confirmation) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
            feedbackElement.style.display = 'block';
        } else if (confirmation) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
            feedbackElement.style.display = 'none';
        } else {
            this.classList.remove('is-valid', 'is-invalid');
            feedbackElement.style.display = 'none';
        }
    });
    
    // Also check when original password changes
    passwordInput.addEventListener('input', function() {
        const confirmation = confirmInput.value;
        if (confirmation) {
            const event = new Event('input');
            confirmInput.dispatchEvent(event);
        }
    });
}

// Export all functions for use in other files
export {
    setupPasswordToggle,
    setupPasswordToggles,
    setupSinglePasswordToggle,
    validatePassword,
    isValidPassword,
    setupPasswordValidation,
    setupPasswordConfirmation,
    PASSWORD_CRITERIA,
    PASSWORD_MESSAGES
};