/**
 * Operations Page Controller
 * Handles document requests and operations tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initOperationsPage();
});

/**
 * Initialize the operations page components
 */
function initOperationsPage() {
    // Load initial data
    loadRequestsData();
    loadOperationsData();
    
    // Setup event listeners
    setupActionButtons();
    setupFilterListeners();
    setupModalListeners();
}

/**
 * Set up listeners for action buttons
 */
function setupActionButtons() {
    // Request document button
    const requestBtn = document.getElementById('requestDocumentBtn');
    if (requestBtn) {
        requestBtn.addEventListener('click', function() {
            showRequestModal();
        });
    }
    
    // Receive document button
    const receiveBtn = document.getElementById('receiveDocumentBtn');
    if (receiveBtn) {
        receiveBtn.addEventListener('click', function() {
            showReceiveModal();
        });
    }
    
    // Cancel request button
    const cancelBtn = document.getElementById('cancelRequestBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            cancelSelectedRequest();
        });
    }
    
    // Refresh operations button
    const refreshBtn = document.getElementById('refreshOperations');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadOperationsData();
        });
    }
}

/**
 * Set up listeners for filter controls
 */
function setupFilterListeners() {
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOperations();
        });
    }
    
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            filterOperations();
        });
    }
    
    // Search input
    const searchInput = document.getElementById('searchOperations');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterOperations();
        });
    }
}

/**
 * Set up listeners for modal actions
 */
function setupModalListeners() {
    // Entity search input in request modal
    const entityInput = document.getElementById('requestEntity');
    if (entityInput) {
        entityInput.addEventListener('input', function() {
            searchEntities(this.value);
        });
    }
    
    // Submit request button
    const submitRequestBtn = document.getElementById('submitRequestBtn');
    if (submitRequestBtn) {
        submitRequestBtn.addEventListener('click', function() {
            submitDocumentRequest();
        });
    }
    
    // Confirm receive button
    const confirmReceiveBtn = document.getElementById('confirmReceiveBtn');
    if (confirmReceiveBtn) {
        confirmReceiveBtn.addEventListener('click', function() {
            confirmDocumentReceive();
        });
    }
}

/**
 * Load requests data into the requests table
 */
function loadRequestsData() {
    // Mock data - would be replaced with API call
    const requests = [
        { id: 'REQ001', type: 'Solicitud', document: 'Cédula', entityName: 'Registraduría Nacional', date: '2025-05-01', status: 'pending' },
        { id: 'REQ002', type: 'Recepción', document: 'Pasaporte', entityName: 'Cancillería', date: '2025-05-03', status: 'completed' },
        { id: 'REQ005', type: 'Recepción', document: 'Historia clínica', entityName: 'SURA EPS', date: '2021-12-09', status: 'completed' },
        { id: 'REQ003', type: 'Solicitud', document: 'Licencia', entityName: 'Ministerio de Transporte', date: '2025-05-05', status: 'failed' },
        { id: 'REQ004', type: 'Solicitud', document: 'Certificado', entityName: 'Cámara de Comercio', date: '2025-05-07', status: 'pending' }
    ];
    
    const requestsTableBody = document.getElementById('requestsTableBody');
    if (!requestsTableBody) return;
    
    requestsTableBody.innerHTML = '';
    
    requests.forEach(req => {
        const row = document.createElement('tr');
        row.dataset.id = req.id;
        row.className = 'request-row';
        
        // Create status badge based on status
        let statusBadge = '';
        switch(req.status) {
            case 'pending':
                statusBadge = '<span class="status-badge status-pending">Pendiente</span>';
                break;
            case 'completed':
                statusBadge = '<span class="status-badge status-completed">Completado</span>';
                break;
            case 'failed':
                statusBadge = '<span class="status-badge status-failed">Fallido</span>';
                break;
        }
        
        // Create action buttons based on request type and status
        let actionButtons = '';
        if (req.status === 'completed') {
            actionButtons = '<i class="bi bi-download action-btn download-btn" title="Descargar"></i>';
        } else if (req.status === 'failed') {
            actionButtons = '<i class="bi bi-arrow-repeat action-btn retry-btn" title="Reintentar"></i>';
        }
        
        row.innerHTML = `
            <td>${req.id}</td>
            <td>${req.type}</td>
            <td>${req.document}</td>
            <td>${req.entityName}</td>
            <td>${formatDate(req.date)}</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
        `;
        
        // Add swipe delete action for pending requests and failed requests
        if (req.status === 'pending' || req.status === 'failed') {
            const swipeActions = document.createElement('div');
            swipeActions.className = 'swipe-actions';
            swipeActions.innerHTML = '<i class="bi bi-trash"></i>';
            row.appendChild(swipeActions);
        }
        
        requestsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons and enable swipe functionality
    addRequestActionListeners();
    enableSwipeToDelete();
}

/**
 * Load operations data into the operations table
 */
function loadOperationsData() {
    // Mock data - would be replaced with API call
    const operations = [
        { 
            id: 'OP001',
            type: 'Solicitud',
            document: 'Cédula',
            entity: 'Registraduría Nacional',
            createdDate: '2025-05-01T10:30:00',
            updatedDate: '2025-05-01T11:45:00',
            status: 'pending'
        },
        { 
            id: 'OP002',
            type: 'Recepción',
            document: 'Pasaporte',
            entity: 'Cancillería',
            createdDate: '2025-05-03T14:20:00',
            updatedDate: '2025-05-03T15:10:00',
            status: 'completed'
        },
        { 
            id: 'OP003',
            type: 'Solicitud',
            document: 'Licencia',
            entity: 'Ministerio de Transporte',
            createdDate: '2025-05-05T09:15:00',
            updatedDate: '2025-05-05T16:30:00',
            status: 'failed'
        },
        { 
            id: 'OP004',
            type: 'Solicitud',
            document: 'Certificado',
            entity: 'Cámara de Comercio',
            createdDate: '2025-05-07T11:00:00',
            updatedDate: '2025-05-07T11:45:00',
            status: 'pending'
        }
    ];
    
    const operationsTableBody = document.getElementById('operationsTableBody');
    if (!operationsTableBody) return;
    
    operationsTableBody.innerHTML = '';
    
    operations.forEach(op => {
        const row = document.createElement('tr');
        row.dataset.id = op.id;
        
        // Create status badge based on status
        let statusBadge = '';
        switch(op.status) {
            case 'pending':
                statusBadge = '<span class="status-badge status-pending">Pendiente</span>';
                break;
            case 'completed':
                statusBadge = '<span class="status-badge status-completed">Completado</span>';
                break;
            case 'failed':
                statusBadge = '<span class="status-badge status-failed">Fallido</span>';
                break;
        }
        
        row.innerHTML = `
            <td>${op.id}</td>
            <td>${op.type}</td>
            <td>${op.document}</td>
            <td>${op.entity}</td>
            <td>${formatDateTime(op.createdDate)}</td>
            <td>${formatDateTime(op.updatedDate)}</td>
            <td>${statusBadge}</td>
            <td><i class="bi bi-info-circle action-btn details-btn" title="Ver Detalles"></i></td>
        `;
        
        operationsTableBody.appendChild(row);
    });
    
    // Add event listeners for details buttons
    const detailButtons = document.querySelectorAll('.details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const operationId = this.closest('tr').dataset.id;
            showOperationDetails(operationId);
        });
    });
}

/**
 * Add event listeners to action buttons in the requests table
 */
function addRequestActionListeners() {
    // Download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.closest('tr').dataset.id;
            downloadRequestDocument(requestId);
        });
    });
    
    // Retry buttons for failed requests
    const retryButtons = document.querySelectorAll('.retry-btn');
    retryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.closest('tr').dataset.id;
            retryFailedRequest(requestId);
        });
    });
    
    // Row selection
    const requestRows = document.querySelectorAll('#requestsTableBody tr');
    requestRows.forEach(row => {
        row.addEventListener('click', function() {
            // Only handle selection, do not trigger any delete functionality
            requestRows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            
            // Just highlight the row without triggering any further actions
            const requestId = this.dataset.id;
            highlightSelectedRow(requestId);
        });
    });
}

/**
 * Enable swipe-to-delete functionality for request rows
 */
function enableSwipeToDelete() {
    const rows = document.querySelectorAll('.request-row');
    
    rows.forEach(row => {
        // Only add swipe to rows with pending status (those with swipe-actions)
        if (!row.querySelector('.swipe-actions')) return;
        
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;
        let swipeTimer = null;
        let hasMoved = false;
        const DEAD_ZONE = 10; // Add a 10px "dead zone" to prevent accidental swipes
        
        // Function to reset row position
        const resetRowPosition = () => {
            row.classList.remove('swiping');
            row.classList.remove('full-swipe');
            row.style.transform = '';
            
            const swipeAction = row.querySelector('.swipe-actions');
            if (swipeAction) {
                swipeAction.style.opacity = '';
            }
            
            // If there was a pending auto-reset timer, clear it
            if (swipeTimer) {
                clearTimeout(swipeTimer);
                swipeTimer = null;
            }
        };
        
        // Function to handle swipe based on distance
        const handleSwipe = (diff) => {
            // If we haven't moved beyond the dead zone, treat as a click, not a swipe
            if (diff <= DEAD_ZONE) {
                resetRowPosition();
                return;
            }
            
            // Clear any existing reset timer
            if (swipeTimer) {
                clearTimeout(swipeTimer);
                swipeTimer = null;
            }
            
            // Short swipe - just reveal delete button
            if (diff > DEAD_ZONE && diff < 150) {
                row.classList.add('swiping');
                row.classList.remove('full-swipe');
                
                // Set a timer to auto-reset the position after 3 seconds
                swipeTimer = setTimeout(resetRowPosition, 3000);
            } 
            // Long swipe - trigger delete confirmation
            else if (diff >= 150) {
                row.classList.add('full-swipe');
                
                // Set a short timer to show the full swipe before asking for confirmation
                setTimeout(() => {
                    const requestId = row.dataset.id;
                    confirmDeleteRequest(requestId);
                    
                    // Reset row position after confirmation dialog is shown
                    setTimeout(resetRowPosition, 300);
                }, 200);
            } 
            // Not enough swipe - reset position
            else {
                resetRowPosition();
            }
        };
        
        // Touch events for mobile
        row.addEventListener('touchstart', function(e) {
            // Only allow swiping on the row itself, not on action buttons
            if (e.target.closest('.action-btn')) return;
            
            startX = e.touches[0].clientX;
            isSwiping = true;
            hasMoved = false;
            
            // Reset any existing swipe state when starting a new swipe
            resetRowPosition();
        }, {passive: true});
        
        row.addEventListener('touchmove', function(e) {
            if (!isSwiping) return;
            
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            // Mark that we've moved (used to distinguish clicks from swipes)
            if (Math.abs(diff) > DEAD_ZONE) {
                hasMoved = true;
            }
            
            // Limit the swipe to a reasonable range (don't allow swiping right)
            if (diff < 0) return;
            
            // Only start visual feedback after leaving the dead zone
            if (diff > DEAD_ZONE) {
                // Use translateX dynamically based on drag position for a natural feel
                row.style.transform = `translateX(-${diff}px)`;
                
                // Gradually show the delete button
                const opacity = (diff - DEAD_ZONE) / 80; // Fully visible at 80px past dead zone
                const swipeAction = this.querySelector('.swipe-actions');
                if (swipeAction) {
                    swipeAction.style.opacity = Math.min(1, opacity);
                }
            }
        }, {passive: true});
        
        row.addEventListener('touchend', function() {
            if (!isSwiping) return;
            
            isSwiping = false;
            
            // If we haven't moved significantly, this was a click, not a swipe
            if (!hasMoved) {
                resetRowPosition();
                return;
            }
            
            // Remove direct style transforms and use classes instead
            row.style.transform = '';
            const swipeAction = this.querySelector('.swipe-actions');
            if (swipeAction) {
                swipeAction.style.opacity = '';
            }
            
            // Handle swipe based on distance
            const diff = startX - currentX;
            handleSwipe(diff);
        });
        
        // Mouse events for desktop
        row.addEventListener('mousedown', function(e) {
            // Only allow swiping on the row itself, not on action buttons
            if (e.target.closest('.action-btn')) return;
            
            startX = e.clientX;
            isSwiping = true;
            hasMoved = false;
            
            // Reset any existing swipe state when starting a new swipe
            resetRowPosition();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isSwiping) return;
            
            currentX = e.clientX;
            const diff = startX - currentX;
            
            // Mark that we've moved (used to distinguish clicks from swipes)
            if (Math.abs(diff) > DEAD_ZONE) {
                hasMoved = true;
            }
            
            // Limit the swipe to a reasonable range (don't allow swiping right)
            if (diff < 0) return;
            
            // Only start visual feedback after leaving the dead zone
            if (diff > DEAD_ZONE) {
                // Use translateX dynamically based on drag position for a natural feel
                row.style.transform = `translateX(-${diff}px)`;
                
                // Gradually show the delete button
                const opacity = (diff - DEAD_ZONE) / 80; // Fully visible at 80px past dead zone
                const swipeAction = row.querySelector('.swipe-actions');
                if (swipeAction) {
                    swipeAction.style.opacity = Math.min(1, opacity);
                }
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (!isSwiping) return;
            
            isSwiping = false;
            
            // If we haven't moved significantly, this was a click, not a swipe
            if (!hasMoved) {
                resetRowPosition();
                return;
            }
            
            // Remove direct style transforms and use classes instead
            row.style.transform = '';
            const swipeAction = row.querySelector('.swipe-actions');
            if (swipeAction) {
                swipeAction.style.opacity = '';
            }
            
            // Handle swipe based on distance
            const diff = startX - currentX;
            handleSwipe(diff);
        });
        
        // Add click handler for the delete button in swipe action
        const swipeAction = row.querySelector('.swipe-actions');
        if (swipeAction) {
            swipeAction.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent row selection
                const requestId = this.closest('tr').dataset.id;
                confirmDeleteRequest(requestId);
                
                // Reset row position after clicking delete
                resetRowPosition();
            });
        }
    });
}

/**
 * Filter operations based on current filter settings
 */
function filterOperations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchText = document.getElementById('searchOperations').value.toLowerCase();
    
    const rows = document.querySelectorAll('#operationsTableBody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(7) .status-badge').textContent.toLowerCase();
        const type = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const document = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const entity = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'pending' && status === 'pendiente') ||
            (statusFilter === 'completed' && status === 'completado') ||
            (statusFilter === 'failed' && status === 'fallido');
            
        const matchesType = typeFilter === 'all' || 
            (typeFilter === 'request' && type === 'solicitud') ||
            (typeFilter === 'receive' && type === 'recepción');
            
        const matchesSearch = searchText === '' || 
            document.includes(searchText) || 
            entity.includes(searchText) || 
            id.includes(searchText);
        
        if (matchesStatus && matchesType && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Show the request document modal
 */
function showRequestModal() {
    const modal = new bootstrap.Modal(document.getElementById('requestDocumentModal'));
    modal.show();
}

/**
 * Show the receive document modal
 */
function showReceiveModal() {
    const modal = new bootstrap.Modal(document.getElementById('receiveDocumentModal'));
    modal.show();
}

/**
 * Show operation details in a modal
 * @param {string} operationId - ID of the operation to display
 */
function showOperationDetails(operationId) {
    // In a real app, you would fetch operation details from the API here
    // Mock operation details for demonstration
    const operationDetails = {
        id: operationId,
        type: 'Solicitud',
        document: 'Cédula',
        entity: 'Registraduría Nacional',
        createdDate: '2025-05-01T10:30:00',
        status: 'pending',
        description: 'Solicitud de copia digital de cédula',
        requestedBy: 'Juan Pérez',
        events: [
            { date: '2025-05-01T10:30:00', description: 'Solicitud creada' },
            { date: '2025-05-01T10:35:00', description: 'Solicitud enviada a la entidad' },
            { date: '2025-05-01T11:45:00', description: 'Solicitud recibida por la entidad' }
        ]
    };
    
    // Populate operation details
    const operationDetailsContainer = document.getElementById('operationDetails');
    operationDetailsContainer.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">ID:</div>
            <div>${operationDetails.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tipo:</div>
            <div>${operationDetails.type}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Documento:</div>
            <div>${operationDetails.document}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Entidad:</div>
            <div>${operationDetails.entity}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Fecha Creación:</div>
            <div>${formatDateTime(operationDetails.createdDate)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Estado:</div>
            <div>${getStatusBadgeHTML(operationDetails.status)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Descripción:</div>
            <div>${operationDetails.description}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Solicitado por:</div>
            <div>${operationDetails.requestedBy}</div>
        </div>
    `;
    
    // Populate timeline events
    const timelineContainer = document.getElementById('timelineEvents');
    timelineContainer.innerHTML = '';
    
    operationDetails.events.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.className = 'list-group-item timeline-event';
        eventItem.innerHTML = `
            <div>${event.description}</div>
            <div class="timeline-date">${formatDateTime(event.date)}</div>
        `;
        timelineContainer.appendChild(eventItem);
    });
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('operationDetailsModal'));
    modal.show();
}

/**
 * Handle the submission of a document request
 */
function submitDocumentRequest() {
    const requestType = document.getElementById('requestType').value;
    const requestEntity = document.getElementById('requestEntity').value;
    const requestNotes = document.getElementById('requestNotes').value;
    
    if (!requestType || !requestEntity) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    // In a real app, this would send data to your API
    console.log('Submitting request:', { requestType, requestEntity, requestNotes });
    
    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById('requestDocumentModal')).hide();
    
    // Show success message
    alert('Solicitud enviada correctamente');
    
    // Reload requests data (would be triggered by API response in real app)
    loadRequestsData();
}

/**
 * Handle the confirmation of a document receipt
 */
function confirmDocumentReceive() {
    const receiveCode = document.getElementById('receiveCode').value;
    const receiveNotes = document.getElementById('receiveNotes').value;
    
    if (!receiveCode) {
        alert('Por favor ingresa el código de recepción');
        return;
    }
    
    // In a real app, this would send data to your API
    console.log('Confirming receipt:', { receiveCode, receiveNotes });
    
    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById('receiveDocumentModal')).hide();
    
    // Show success message
    alert('Recepción confirmada correctamente');
    
    // Reload requests data (would be triggered by API response in real app)
    loadRequestsData();
}

/**
 * Cancel the selected request
 */
function cancelSelectedRequest() {
    const selectedRequest = document.querySelector('#requestsTableBody tr.selected');
    
    if (!selectedRequest) {
        alert('Por favor selecciona una solicitud para eliminar');
        return;
    }
    
    const requestId = selectedRequest.dataset.id;
    confirmDeleteRequest(requestId);
}

/**
 * Confirm deletion of a request
 * @param {string} requestId - ID of the request to delete
 */
function confirmDeleteRequest(requestId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
        // In a real app, this would call your API to delete the request
        console.log('Deleting request:', requestId);
        
        // Remove the row from the UI
        const row = document.querySelector(`#requestsTableBody tr[data-id="${requestId}"]`);
        if (row) {
            row.remove();
        }
        
        // Show success message
        alert('Solicitud cancelada correctamente');
    }
}

/**
 * Download a document from a request
 * @param {string} requestId - ID of the request to download
 */
function downloadRequestDocument(requestId) {
    // In a real app, this would call your API to download the document
    console.log('Downloading document for request:', requestId);
    
    // Show success message (in a real app, this would trigger the actual file download)
    alert('Descargando documento...');
}

/**
 * Retry a failed request
 * @param {string} requestId - ID of the request to retry
 */
function retryFailedRequest(requestId) {
    // In a real app, this would call your API to retry the request
    console.log('Retrying failed request:', requestId);
    
    // Show confirmation message with the same pattern as download function
    alert('Reintentando solicitud fallida...');
    
    // Simulate API call success
    setTimeout(() => {
        // In a real app, the API would handle changing the status to pending
        alert('Solicitud enviada nuevamente. Estado cambiado a "Pendiente"');
        
        // Reload requests data (would be triggered by API response in real app)
        loadRequestsData();
    }, 1000);
}

/**
 * Search for entities/users based on input
 * @param {string} query - Search query
 */
function searchEntities(query) {
    if (!query || query.length < 3) {
        document.getElementById('entityResults').classList.add('d-none');
        return;
    }
    
    // Mock entities for demonstration
    const entities = [
        { id: 1, name: 'Registraduría Nacional', type: 'entity' },
        { id: 2, name: 'Cancillería', type: 'entity' },
        { id: 3, name: 'Ministerio de Transporte', type: 'entity' },
        { id: 4, name: 'Cámara de Comercio', type: 'entity' },
        { id: 5, name: 'Juan Pérez', type: 'user' },
        { id: 6, name: 'María González', type: 'user' }
    ];
    
    // Filter entities based on query
    const filteredEntities = entities.filter(entity => 
        entity.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Display results
    const resultsContainer = document.getElementById('entityResults');
    resultsContainer.innerHTML = '';
    
    if (filteredEntities.length === 0) {
        resultsContainer.innerHTML = '<div class="entity-item">No se encontraron resultados</div>';
    } else {
        filteredEntities.forEach(entity => {
            const entityItem = document.createElement('div');
            entityItem.className = 'entity-item';
            entityItem.innerHTML = `
                <strong>${entity.name}</strong> 
                <small>(${entity.type === 'entity' ? 'Entidad' : 'Usuario'})</small>
            `;
            entityItem.addEventListener('click', function() {
                document.getElementById('requestEntity').value = entity.name;
                resultsContainer.classList.add('d-none');
            });
            resultsContainer.appendChild(entityItem);
        });
    }
    
    resultsContainer.classList.remove('d-none');
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format a date string to a readable date and time format
 * @param {string} dateTimeString - ISO date string
 * @returns {string} Formatted date and time
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Get HTML for a status badge
 * @param {string} status - Status value
 * @returns {string} HTML for status badge
 */
function getStatusBadgeHTML(status) {
    switch(status) {
        case 'pending':
            return '<span class="status-badge status-pending">Pendiente</span>';
        case 'completed':
            return '<span class="status-badge status-completed">Completado</span>';
        case 'failed':
            return '<span class="status-badge status-failed">Fallido</span>';
        default:
            return '<span class="status-badge">Desconocido</span>';
    }
}

/**
 * Show a message indicating which row is selected
 * @param {string} requestId - ID of the selected request
 */
function showSelectionMessage(requestId) {
    // Get details of the selected request
    const row = document.querySelector(`#requestsTableBody tr[data-id="${requestId}"]`);
    if (!row) return;
    
    const document = row.querySelector('td:nth-child(3)').textContent;
    const status = row.querySelector('td:nth-child(6) .status-badge').textContent;
    
    // Create selection status message (can be displayed in a tooltip or other UI element)
    console.log(`Seleccionado: ${document} (${requestId}) - Estado: ${status}`);
    
    // If you want to display this message in the UI, you could add a status area
    // For now, we'll just highlight the selected row clearly with CSS
}

/**
 * Highlight the selected row without triggering any modal or deletion
 * @param {string} requestId - ID of the selected request
 */
function highlightSelectedRow(requestId) {
    // Get the selected row
    const row = document.querySelector(`#requestsTableBody tr[data-id="${requestId}"]`);
    if (!row) return;
    
    // Add visual indication of selection (the CSS class 'selected' is already applied in the click handler)
    
    // Optionally log selection for debugging
    const document = row.querySelector('td:nth-child(3)').textContent;
    const status = row.querySelector('td:nth-child(6) .status-badge').textContent;
    console.log(`Row selected: ${document} (${requestId}) - Status: ${status}`);
}