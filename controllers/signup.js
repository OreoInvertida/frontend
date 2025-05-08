import { 
    setupPasswordToggles, 
    setupPasswordValidation, 
    setupPasswordConfirmation,
    isValidPassword 
} from '../utilities/form-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const button = document.getElementById('signup-button');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Setup password toggle functionality using shared utility
    setupPasswordToggles();
    
    // Setup password validation with requirements feedback
    setupPasswordValidation('password');
    
    // Setup password confirmation validation
    setupPasswordConfirmation('password', 'confirm-password');

    // Form validation
    form.addEventListener('input', () => {
        // Check if the form is valid and password meets criteria
        const isFormValid = form.checkValidity();
        const isPasswordValid = passwordInput.value ? isValidPassword(passwordInput.value) : false;
        const doPasswordsMatch = confirmPasswordInput.value === passwordInput.value;
        
        // Enable button only if all conditions are met
        button.disabled = !(isFormValid && isPasswordValid && doPasswordsMatch);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/signup-endpoint', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
                /**
                 * TODO: Define transaction identifiers
                 */
            }
        }).then(response => {
            if (response.ok) {
                alert('Cuenta registrada exitosamente');
            } else {
                alert('Hubo un error al registrar la cuenta, si el problema persiste, por favor contáctanos.');
            }
        });
    });
});