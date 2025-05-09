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
    loadTransferHistory();
    
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
function loadOperatorsData() {
    // Mock data - would be replaced with API call
    const operators = [
        {
            id: 'op1',
            name: 'OREO-FRONT',
            type: 'public',
            description: 'Operador principal de carpeta ciudadana',
            icon: 'building',
            capabilities: [
                { name: 'Documentos Personales', icon: 'file-earmark-person' },
                { name: 'Solicitudes Entidades Públicas', icon: 'bank' },
                { name: 'Compartir Documentos', icon: 'share' }
            ],
            stats: {
                users: '5,000,000+',
                documents: '25,000,000+',
                availability: '99.9%'
            },
            isCurrent: true
        },
        {
            id: 'op2',
            name: 'DocuCloud',
            type: 'private',
            description: 'Solución de gestión documental en la nube',
            icon: 'cloud',
            capabilities: [
                { name: 'Almacenamiento Ilimitado', icon: 'hdd' },
                { name: 'OCR y Búsqueda de Texto', icon: 'search' },
                { name: 'Firma Digital', icon: 'pen' }
            ],
            stats: {
                users: '2,100,000+',
                documents: '18,000,000+',
                availability: '99.8%'
            },
            isCurrent: false
        },
        {
            id: 'op3',
            name: 'GobDigital',
            type: 'public',
            description: 'Operador oficial del gobierno nacional',
            icon: 'bank',
            capabilities: [
                { name: 'Trámites Gubernamentales', icon: 'file-earmark-text' },
                { name: 'Certificados Oficiales', icon: 'award' },
                { name: 'Identificación Digital', icon: 'fingerprint' }
            ],
            stats: {
                users: '8,500,000+',
                documents: '40,000,000+',
                availability: '99.5%'
            },
            isCurrent: false
        },
        {
            id: 'op4',
            name: 'SecureVault',
            type: 'private',
            description: 'Protección de documentos con cifrado avanzado',
            icon: 'shield-lock',
            capabilities: [
                { name: 'Cifrado de Extremo a Extremo', icon: 'lock' },
                { name: 'Autenticación Multifactor', icon: 'shield-check' },
                { name: 'Acceso Biométrico', icon: 'fingerprint' }
            ],
            stats: {
                users: '1,200,000+',
                documents: '8,000,000+',
                availability: '99.95%'
            },
            isCurrent: false
        },
        {
            id: 'op5',
            name: 'DocuMed',
            type: 'private',
            description: 'Especializado en historias clínicas y documentos médicos',
            icon: 'hospital',
            capabilities: [
                { name: 'Historias Clínicas Digitales', icon: 'file-medical' },
                { name: 'Confidencialidad Médica', icon: 'shield-plus' },
                { name: 'Recetas Electrónicas', icon: 'prescription' }
            ],
            stats: {
                users: '800,000+',
                documents: '12,000,000+',
                availability: '97.5%'
            },
            isCurrent: false
        },
        {
            id: 'op6',
            name: 'EduDocs',
            type: 'public',
            description: 'Gestión documental para instituciones educativas',
            icon: 'mortarboard',
            capabilities: [
                { name: 'Certificados Académicos', icon: 'file-earmark-richtext' },
                { name: 'Expedientes Estudiantiles', icon: 'person-vcard' },
                { name: 'Títulos Digitales', icon: 'award' }
            ],
            stats: {
                users: '1,500,000+',
                documents: '9,000,000+',
                availability: '98.2%'
            },
            isCurrent: false
        }
    ];
    
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
function loadCurrentOperator() {
    // Mock data - would be replaced with API call
    const currentOperator = {
        id: 'op1',
        name: 'OREO-FRONT',
        type: 'public',
        status: 'active',
        icon: 'building',
        since: '2023-01-15',
        stats: {
            documents: 154,
            requests: 23,
            entities: 12
        }
    };
    
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
 * Load transfer history data
 */
function loadTransferHistory() {
    // Mock data - would be replaced with API call
    const transferHistory = [
        {
            date: '2023-01-15',
            fromOperator: 'DocuCloud',
            toOperator: 'OREO-FRONT',
            status: 'completed'
        },
        {
            date: '2022-08-22',
            fromOperator: 'GobDigital',
            toOperator: 'DocuCloud',
            status: 'completed'
        }
    ];
    
    const transferHistoryBody = document.getElementById('transferHistoryBody');
    if (!transferHistoryBody) return;
    
    transferHistoryBody.innerHTML = '';
    
    if (transferHistory.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="4" class="text-center">No hay historial de transferencias</td>';
        transferHistoryBody.appendChild(emptyRow);
        return;
    }
    
    transferHistory.forEach(transfer => {
        const row = document.createElement('tr');
        
        // Create status badge
        let statusBadge = '';
        switch(transfer.status) {
            case 'completed':
                statusBadge = '<span class="status-badge status-completed">Completada</span>';
                break;
            case 'pending':
                statusBadge = '<span class="status-badge status-pending">Pendiente</span>';
                break;
            case 'failed':
                statusBadge = '<span class="status-badge status-failed">Fallida</span>';
                break;
        }
        
        // Format date
        const date = new Date(transfer.date);
        const dateFormatted = date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${dateFormatted}</td>
            <td>${transfer.fromOperator}</td>
            <td>${transfer.toOperator}</td>
            <td>${statusBadge}</td>
        `;
        
        transferHistoryBody.appendChild(row);
    });
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
function submitTransferRequest() {
    const confirmTransferBtn = document.getElementById('confirmTransferBtn');
    if (!confirmTransferBtn) return;
    
    const operatorId = confirmTransferBtn.dataset.operatorId;
    
    if (!operatorId) return;
    
    // In a real app, this would send data to your API
    console.log('Submitting transfer request to operator:', operatorId);
    
    // Hide the confirmation modal
    bootstrap.Modal.getInstance(document.getElementById('transferConfirmationModal')).hide();
    
    // Show success message
    alert('Su solicitud de transferencia ha sido enviada. Recibirá una notificación cuando el proceso esté listo para completarse.');
    
    // Reload transfer history to show the pending transfer
    // This would be triggered by API response in a real app
    // For demo purposes, we'll just add a new pending transfer
    addPendingTransfer(operatorId);
}

/**
 * Add a pending transfer to the transfer history
 * @param {string} operatorId - ID of the target operator
 */
function addPendingTransfer(operatorId) {
    // Find the operator name based on the ID
    const operators = [
        { id: 'op1', name: 'OREO-FRONT' },
        { id: 'op2', name: 'DocuCloud' },
        { id: 'op3', name: 'GobDigital' },
        { id: 'op4', name: 'SecureVault' },
        { id: 'op5', name: 'DocuMed' },
        { id: 'op6', name: 'EduDocs' }
    ];
    
    const currentOperator = 'OREO-FRONT';
    const targetOperator = operators.find(op => op.id === operatorId)?.name || 'Operador Desconocido';
    
    // Current date formatted
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create a new row for the transfer history table
    const transferHistoryBody = document.getElementById('transferHistoryBody');
    if (!transferHistoryBody) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${dateFormatted}</td>
        <td>${currentOperator}</td>
        <td>${targetOperator}</td>
        <td><span class="status-badge status-pending">Pendiente</span></td>
    `;
    
    // Add the new row at the top of the table
    if (transferHistoryBody.firstChild) {
        transferHistoryBody.insertBefore(newRow, transferHistoryBody.firstChild);
    } else {
        transferHistoryBody.appendChild(newRow);
    }
}