/**
 * Operators Page Controller
 * Handles operator listing and transfer requests
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initOperatorsPage();
});

/**
 * Initialize the operators page components
 */
function initOperatorsPage() {
    // Load initial data
    loadOperatorsData();
    loadCurrentOperator();
    
    // Setup event listeners
    setupFilterListeners();
    setupTransferListeners();
}

/**
 * Set up listeners for filter and search controls
 */
function setupFilterListeners() {    
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filterOperators();
        });
    }
    
    // Search input and button
    const searchInput = document.getElementById('searchOperators');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search when button is clicked
        searchBtn.addEventListener('click', function() {
            filterOperators();
        });
        
        // Search when Enter key is pressed in the input
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterOperators();
            }
        });
    }
}

/**
 * Set up listeners for transfer-related actions
 */
function setupTransferListeners() {
    // Request transfer button in operator details modal
    const requestTransferBtn = document.getElementById('requestTransferBtn');
    if (requestTransferBtn) {
        requestTransferBtn.addEventListener('click', function() {
            showTransferConfirmation();
        });
    }
    
    // Transfer confirmation checkbox
    const confirmTransferCheck = document.getElementById('confirmTransferCheck');
    const confirmTransferBtn = document.getElementById('confirmTransferBtn');
    
    if (confirmTransferCheck && confirmTransferBtn) {
        confirmTransferCheck.addEventListener('change', function() {
            confirmTransferBtn.disabled = !this.checked;
        });
    }
    
    // Confirm transfer button
    if (confirmTransferBtn) {
        confirmTransferBtn.addEventListener('click', function() {
            submitTransferRequest();
        });
    }
}

/**
 * Load operators data and render in the grid
 */
async function loadOperatorsData() {
    try {
        // Import the operator service
        const { default: OperatorService } = await import('../services/operator-service.js');
        
        // Get operators from API
        const response = await OperatorService.getOperators();
        
        if (response.success && response.operators) {
            renderOperators(response.operators);
        } else {
            console.error('Error loading operators:', response);
            alert('Error al cargar la lista de operadores.');
        }
    } catch (error) {
        console.error('Error loading operators:', error);
        alert('Error al cargar la lista de operadores.');
    }
}

/**
 * Render operators in the grid
 * @param {Array} operators - Array of operator objects 
 */
function renderOperators(operators) {
    const operatorsGrid = document.getElementById('operatorsGrid');
    if (!operatorsGrid) return;
    
    operatorsGrid.innerHTML = '';
    
    operators.forEach(operator => {
        const operatorCard = document.createElement('div');
        operatorCard.className = `operator-card ${operator.isCurrent ? 'current' : ''}`;
        operatorCard.dataset.id = operator.id;
        
        // Current indicator
        let currentIndicator = '';
        if (operator.isCurrent) {
            currentIndicator = '<div class="current-indicator mt-2 text-primary"><i class="bi bi-check-circle-fill"></i> Operador Actual</div>';
        }
        
        operatorCard.innerHTML = `
            <div class="operator-logo">
                <i class="bi bi-${operator.icon}"></i>
            </div>
            <div class="operator-name">${operator.name}</div>
            <div class="operator-type">${operator.type === 'public' ? 'Operador Público' : 'Operador Privado'}</div>
            <div class="operator-details">${operator.description}</div>
            ${currentIndicator}
        `;
        
        // Add click event to show operator details
        operatorCard.addEventListener('click', function() {
            showOperatorDetails(operator);
        });
        
        operatorsGrid.appendChild(operatorCard);
    });
}

/**
 * Load current operator information
 */
async function loadCurrentOperator() {
    try {
        // Import the operator service
        const { default: OperatorService } = await import('../services/operator-service.js');
        
        // Get current operator from API
        const response = await OperatorService.getCurrentOperator();
        
        if (response.success && response.operator) {
            renderCurrentOperator(response.operator);
        } else {
            console.error('Error loading current operator:', response);
        }
    } catch (error) {
        console.error('Error loading current operator:', error);
    }
}

/**
 * Render current operator information
 * @param {Object} currentOperator - Current operator data object
 */
function renderCurrentOperator(currentOperator) {
    const currentOperatorElement = document.getElementById('currentOperator');
    if (!currentOperatorElement) return;
    
    // Format date
    const since = new Date(currentOperator.since);
    const sinceFormatted = since.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    currentOperatorElement.innerHTML = `
        <div class="current-operator-logo">
            <i class="bi bi-${currentOperator.icon}"></i>
        </div>
        <div class="current-operator-details">
            <div class="current-operator-name">${currentOperator.name}</div>
            <div class="current-operator-since">Usuario desde ${sinceFormatted}</div>
            <div class="current-operator-stats">
                <div class="current-stat">
                    <div class="stat-value">${currentOperator.stats.documents}</div>
                    <div class="stat-title">Documentos</div>
                </div>
                <div class="current-stat">
                    <div class="stat-value">${currentOperator.stats.requests}</div>
                    <div class="stat-title">Solicitudes</div>
                </div>
                <div class="current-stat">
                    <div class="stat-value">${currentOperator.stats.entities}</div>
                    <div class="stat-title">Entidades</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter operators based on current filter settings
 */
function filterOperators() {
    const typeFilter = document.getElementById('typeFilter').value;
    const searchText = document.getElementById('searchOperators').value.toLowerCase();
    
    const operatorCards = document.querySelectorAll('.operator-card');
    
    operatorCards.forEach(card => {
        const type = card.querySelector('.operator-type').textContent.toLowerCase().includes('público') ? 'public' : 'private';
        const name = card.querySelector('.operator-name').textContent.toLowerCase();
        const details = card.querySelector('.operator-details').textContent.toLowerCase();
        
        const matchesType = typeFilter === 'all' || 
            (typeFilter === 'public' && type === 'public') ||
            (typeFilter === 'private' && type === 'private');
            
        const matchesSearch = searchText === '' || 
            name.includes(searchText) || 
            details.includes(searchText);
        
        if (matchesType && matchesSearch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Show operator details in a modal
 * @param {Object} operator - Operator data object
 */
function showOperatorDetails(operator) {
    // Set the modal title
    const modalTitle = document.getElementById('operatorDetailsModalLabel');
    if (modalTitle) {
        modalTitle.textContent = `Detalles del Operador: ${operator.name}`;
    }
    
    // Populate operator details
    const operatorDetailsContainer = document.getElementById('operatorDetails');
    if (operatorDetailsContainer) {
        operatorDetailsContainer.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <div class="operator-logo me-3">
                    <i class="bi bi-${operator.icon}"></i>
                </div>
                <div>
                    <h4 class="mb-1">${operator.name}</h4>
                    <div class="text-muted">${operator.type === 'public' ? 'Operador Público' : 'Operador Privado'}</div>
                </div>
            </div>
            <p>${operator.description}</p>
        `;
    }
    
    // Populate statistics
    document.getElementById('userCount').textContent = operator.stats.users;
    document.getElementById('documentCount').textContent = operator.stats.documents;
    document.getElementById('availability').textContent = operator.stats.availability;
    
    // Populate capabilities
    const capabilitiesList = document.getElementById('capabilitiesList');
    if (capabilitiesList) {
        capabilitiesList.innerHTML = '';
        
        operator.capabilities.forEach(capability => {
            const capabilityItem = document.createElement('li');
            capabilityItem.className = 'list-group-item capability-item';
            capabilityItem.innerHTML = `
                <i class="bi bi-${capability.icon}"></i>
                ${capability.name}
            `;
            capabilitiesList.appendChild(capabilityItem);
        });
    }
    
    // Set current operator status
    const requestTransferBtn = document.getElementById('requestTransferBtn');
    if (requestTransferBtn) {
        if (operator.isCurrent) {
            requestTransferBtn.disabled = true;
            requestTransferBtn.textContent = 'Operador Actual';
        } else {
            requestTransferBtn.disabled = false;
            requestTransferBtn.textContent = 'Solicitar Transferencia';
            
            // Store the selected operator ID for transfer
            requestTransferBtn.dataset.operatorId = operator.id;
            requestTransferBtn.dataset.operatorName = operator.name;
        }
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('operatorDetailsModal'));
    modal.show();
}

/**
 * Show transfer confirmation modal
 */
function showTransferConfirmation() {
    // Get the selected operator from the button's data attributes
    const requestTransferBtn = document.getElementById('requestTransferBtn');
    if (!requestTransferBtn) return;
    
    const operatorId = requestTransferBtn.dataset.operatorId;
    const operatorName = requestTransferBtn.dataset.operatorName;
    
    if (!operatorId || !operatorName) return;
    
    // Set the operator name in the confirmation modal
    const targetOperatorName = document.getElementById('targetOperatorName');
    if (targetOperatorName) {
        targetOperatorName.textContent = operatorName;
    }
    
    // Reset the checkbox
    const confirmTransferCheck = document.getElementById('confirmTransferCheck');
    if (confirmTransferCheck) {
        confirmTransferCheck.checked = false;
    }
    
    // Disable the confirm button
    const confirmTransferBtn = document.getElementById('confirmTransferBtn');
    if (confirmTransferBtn) {
        confirmTransferBtn.disabled = true;
        confirmTransferBtn.dataset.operatorId = operatorId;
    }
    
    // Hide the details modal
    bootstrap.Modal.getInstance(document.getElementById('operatorDetailsModal')).hide();
    
    // Show the confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById('transferConfirmationModal'));
    confirmModal.show();
}

/**
 * Submit transfer request
 */
async function submitTransferRequest() {
    const confirmTransferBtn = document.getElementById('confirmTransferBtn');
    if (!confirmTransferBtn) return;
    
    const operatorId = confirmTransferBtn.dataset.operatorId;
    
    if (!operatorId) return;
    
    try {
        // Import the operator service
        const { default: OperatorService } = await import('../services/operator-service.js');
        
        // Call the transfer request method
        const response = await OperatorService.requestTransfer(operatorId);
        
        if (response.success) {
            // Hide the confirmation modal
            bootstrap.Modal.getInstance(document.getElementById('transferConfirmationModal')).hide();
            
            // Show success message
            alert(response.message || 'Su solicitud de transferencia ha sido enviada. Recibirá una notificación cuando el proceso esté listo para completarse.');
        } else {
            alert('Error al enviar la solicitud de transferencia');
        }
    } catch (error) {
        console.error('Error submitting transfer request:', error);
        alert(error.data?.message || 'Error al enviar la solicitud de transferencia');
    }
}