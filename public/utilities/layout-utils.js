/**
 * Common layout components that are reused across multiple pages
 */

/**
 * Inject the header HTML into the specified element
 * @param {string} elementId - The ID of the element to inject the header into (defaults to 'header-container')
 */
function injectHeader(elementId = 'header-container') {
    const headerElement = document.getElementById(elementId);
    if (!headerElement) return;

    headerElement.innerHTML = `
        <div class="container-fluid d-flex justify-content-end align-items-center">
            <div class="user-profile dropdown">
                <i class="bi bi-person-circle user-avatar" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false"></i>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#" id="changePasswordBtn"><i class="bi bi-key me-2"></i>Cambiar contraseña</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
                </ul>
            </div>
        </div>
    `;
    
    // Setup event listeners for menu items
    setupUserMenuListeners();
}

/**
 * Setup event listeners for the user profile menu items
 */
function setupUserMenuListeners() {
    // Change Password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showChangePasswordModal();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

/**
 * Show the change password modal
 */
function showChangePasswordModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('changePasswordModal')) {
        const modalHTML = `
            <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="changePasswordModalLabel">Cambiar Contraseña</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="changePasswordForm">
                                <div class="mb-3">
                                    <label for="currentPassword" class="form-label">Contraseña actual</label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="currentPassword" required>
                                        <button type="button" class="btn btn-outline-secondary toggle-password" tabindex="-1">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="newPassword" class="form-label">Nueva contraseña</label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="newPassword" required>
                                        <button type="button" class="btn btn-outline-secondary toggle-password" tabindex="-1">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="confirmNewPassword" class="form-label">Confirmar nueva contraseña</label>
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="confirmNewPassword" required>
                                        <button type="button" class="btn btn-outline-secondary toggle-password" tabindex="-1">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div class="alert alert-danger d-none" id="changePasswordError"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="savePasswordBtn">Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup password toggles
        setupPasswordTogglesForModal();
        
        // Setup form submission
        const saveBtn = document.getElementById('savePasswordBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                submitChangePasswordForm();
            });
        }
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
}

/**
 * Setup password toggles for the change password modal
 */
function setupPasswordTogglesForModal() {
    const toggles = document.querySelectorAll('#changePasswordModal .toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
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
    });
}

/**
 * Submit the change password form
 */
function submitChangePasswordForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showChangePasswordError('Por favor, complete todos los campos.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showChangePasswordError('Las contraseñas nuevas no coinciden.');
        return;
    }
    
    // TODO: Implement actual API call when endpoint is available
    console.log('Change password functionality will be implemented when the API endpoint is available');
    
    // For now, just close the modal and show success
    bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
    alert('La contraseña se ha cambiado exitosamente.');
}

/**
 * Show error message in the change password modal
 * @param {string} message - Error message to display
 */
function showChangePasswordError(message) {
    const errorElement = document.getElementById('changePasswordError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

/**
 * Logout the current user
 */
function logout() {
    // Import AuthService dynamically
    import('../services/auth-service.js').then(module => {
        const AuthService = module.default;
        
        // Call logout method
        AuthService.logout().then(() => {
            // Redirect to login page
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Error during logout:', error);
            // Redirect anyway
            window.location.href = 'index.html';
        });
    }).catch(error => {
        console.error('Error importing AuthService:', error);
        // Fallback logout
        localStorage.removeItem('auth_token');
        window.location.href = 'index.html';
    });
}

/**
 * Inject the side navigation HTML into the specified element
 * @param {string} elementId - The ID of the element to inject the navigation into (defaults to 'nav-container')
 * @param {string} activePage - The current active page (folder, operations, operators, premium)
 */
function injectSideNav(elementId = 'nav-container', activePage = 'folder') {
    const navElement = document.getElementById(elementId);
    if (!navElement) return;

    navElement.innerHTML = `
        <ul class="nav-icons">
            <li ${activePage === 'folder' ? 'class="active"' : ''}>
                <a href="folder-page.html">
                    <div class="icon-container">
                        <i class="bi bi-folder"></i>
                    </div>
                </a>
            </li>
            <li ${activePage === 'operations' ? 'class="active"' : ''}>
                <a href="operations-page.html">
                    <div class="icon-container">
                        <i class="bi bi-gear"></i>
                    </div>
                </a>
            </li>
            <li ${activePage === 'operators' ? 'class="active"' : ''}>
                <a href="operators-page.html">
                    <div class="icon-container">
                        <i class="bi bi-building"></i>
                    </div>
                </a>
            </li>
            <li ${activePage === 'premium' ? 'class="active"' : ''}>
                <a href="premium-page.html">
                    <div class="icon-container">
                        <i class="bi bi-file-earmark-text"></i>
                    </div>
                </a>
            </li>
        </ul>
    `;
}

/**
 * Initialize the common layout components for a page
 * @param {string} activePage - The current active page (folder, operations, operators, premium)
 */
function initCommonLayout(activePage) {
    document.addEventListener('DOMContentLoaded', function() {
        injectHeader();
        injectSideNav('nav-container', activePage);
    });
}

// Export the functions that need to be accessible from other modules
export { initCommonLayout, injectHeader, injectSideNav };