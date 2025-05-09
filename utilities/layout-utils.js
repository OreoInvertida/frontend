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
            <div class="user-profile">
                <i class="bi bi-person-circle user-avatar"></i>
            </div>
        </div>
    `;
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