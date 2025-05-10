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
    // Clone and set up tables from template
    setupTables();
    
    // Load initial data
    loadRequestsData();
    loadOperationsData();
    
    // Setup event listeners
    setupActionButtons();
    setupFilterListeners();
    setupModalListeners();
}

/**
 * Set up tables using the template
 */
function setupTables() {
    // Get the template
    const tableTemplate = document.getElementById('requestsTableTemplate');
    
    // Set up incoming requests table
    const incomingTable = document.importNode(tableTemplate.content, true);
    const incomingTableBody = incomingTable.querySelector('tbody');
    incomingTableBody.id = 'requestsTableBody';
    document.getElementById('incomingRequestsContainer').appendChild(incomingTable);
    
    // Set up outgoing requests table
    const outgoingTable = document.importNode(tableTemplate.content, true);
    const outgoingTableBody = outgoingTable.querySelector('tbody');
    outgoingTableBody.id = 'operationsTableBody';
    document.getElementById('outgoingRequestsContainer').appendChild(outgoingTable);
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
    // Status filters
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOperations();
        });
    }
    
    const incomingStatusFilter = document.getElementById('incomingStatusFilter');
    if (incomingStatusFilter) {
        incomingStatusFilter.addEventListener('change', function() {
            filterIncomingRequests();
        });
    }
    
    // Search inputs
    const searchOperations = document.getElementById('searchOperations');
    if (searchOperations) {
        searchOperations.addEventListener('input', function() {
            filterOperations();
        });
    }
    
    const searchIncomingRequests = document.getElementById('searchIncomingRequests');
    if (searchIncomingRequests) {
        searchIncomingRequests.addEventListener('input', function() {
            filterIncomingRequests();
        });
    }
    
    // Refresh buttons
    const refreshOperations = document.getElementById('refreshOperations');
    if (refreshOperations) {
        refreshOperations.addEventListener('click', function() {
            loadOperationsData();
        });
    }
    
    const refreshIncomingRequests = document.getElementById('refreshIncomingRequests');
    if (refreshIncomingRequests) {
        refreshIncomingRequests.addEventListener('click', function() {
            loadRequestsData();
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
        { id: 'REQ001', type: 'Solicitud', document: 'Cédula', entityName: 'Registraduría Nacional', status: 'pending' },
        { id: 'REQ002', type: 'Recepción', document: 'Pasaporte', entityName: 'Cancillería', status: 'completed' },
        { id: 'REQ005', type: 'Recepción', document: 'Historia clínica', entityName: 'SURA EPS', status: 'completed' },
        { id: 'REQ003', type: 'Solicitud', document: 'Licencia', entityName: 'Ministerio de Transporte', status: 'failed' },
        { id: 'REQ004', type: 'Solicitud', document: 'Certificado', entityName: 'Cámara de Comercio', status: 'pending' }
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
        
        // Create action buttons based on request status
        let actionButtons = '<i class="bi bi-info-circle action-btn details-btn" title="Ver Detalles"></i>';
        
        if (req.status === 'failed') {
            actionButtons += ' <i class="bi bi-arrow-repeat action-btn retry-btn" title="Reintentar"></i>';
        }
        
        actionButtons += ' <i class="bi bi-trash action-btn delete-btn" title="Eliminar"></i>';
        
        row.innerHTML = `
            <td>${req.id}</td>
            <td>${req.type}</td>
            <td>${req.document}</td>
            <td>${req.entityName}</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
        `;
        
        requestsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addRequestActionListeners();
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
            status: 'pending'
        },
        { 
            id: 'OP002',
            type: 'Recepción',
            document: 'Pasaporte',
            entity: 'Cancillería',
            status: 'completed'
        },
        { 
            id: 'OP003',
            type: 'Solicitud',
            document: 'Licencia',
            entity: 'Ministerio de Transporte',
            status: 'failed'
        },
        { 
            id: 'OP004',
            type: 'Solicitud',
            document: 'Certificado',
            entity: 'Cámara de Comercio',
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
        
        // Create action buttons
        const actionButtons = `
            <i class="bi bi-info-circle action-btn details-btn" title="Ver Detalles"></i>
            <i class="bi bi-arrow-repeat action-btn retry-btn" title="Reintentar"></i>
            <i class="bi bi-trash action-btn delete-btn" title="Eliminar"></i>
        `;
        
        row.innerHTML = `
            <td>${op.id}</td>
            <td>${op.type}</td>
            <td>${op.document}</td>
            <td>${op.entity}</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
        `;
        
        operationsTableBody.appendChild(row);
    });
    
    // Add event listeners for action buttons
    addOperationActionListeners();
}

/**
 * Add event listeners to action buttons in the requests table
 */
function addRequestActionListeners() {
    // Details buttons
    const detailButtons = document.querySelectorAll('#requestsTableBody .details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.closest('tr').dataset.id;
            showRequestDetails(requestId);
        });
    });
    
    // Retry buttons for failed requests
    const retryButtons = document.querySelectorAll('#requestsTableBody .retry-btn');
    retryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.closest('tr').dataset.id;
            retryFailedRequest(requestId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#requestsTableBody .delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const requestId = this.closest('tr').dataset.id;
            confirmDeleteRequest(requestId);
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
 * Add event listeners to action buttons in the operations table
 */
function addOperationActionListeners() {
    // Details buttons
    const detailButtons = document.querySelectorAll('#operationsTableBody .details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const operationId = this.closest('tr').dataset.id;
            showOperationDetails(operationId);
        });
    });
    
    // Retry buttons
    const retryButtons = document.querySelectorAll('#operationsTableBody .retry-btn');
    retryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const operationId = this.closest('tr').dataset.id;
            retryFailedOperation(operationId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#operationsTableBody .delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const operationId = this.closest('tr').dataset.id;
            confirmDeleteOperation(operationId);
        });
    });
}

/**
 * Filter operations based on current filter settings
 */
function filterOperations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchText = document.getElementById('searchOperations').value.toLowerCase();
    
    const rows = document.querySelectorAll('#operationsTableBody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(5) .status-badge').textContent.toLowerCase();
        const type = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const document = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const entity = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'pending' && status === 'pendiente') ||
            (statusFilter === 'completed' && status === 'completado') ||
            (statusFilter === 'failed' && status === 'fallido');
            
        const matchesSearch = searchText === '' || 
            document.includes(searchText) || 
            entity.includes(searchText) || 
            id.includes(searchText) ||
            type.includes(searchText);
        
        if (matchesStatus && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Filter incoming requests based on current filter settings
 */
function filterIncomingRequests() {
    const statusFilter = document.getElementById('incomingStatusFilter').value;
    const searchText = document.getElementById('searchIncomingRequests').value.toLowerCase();
    
    const rows = document.querySelectorAll('#requestsTableBody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(5) .status-badge').textContent.toLowerCase();
        const type = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const document = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const entity = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const id = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'pending' && status === 'pendiente') ||
            (statusFilter === 'completed' && status === 'completado') ||
            (statusFilter === 'failed' && status === 'fallido');
            
        const matchesSearch = searchText === '' || 
            document.includes(searchText) || 
            entity.includes(searchText) || 
            id.includes(searchText) ||
            type.includes(searchText);
        
        if (matchesStatus && matchesSearch) {
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
 * Show the request details in a modal
 * @param {string} requestId - ID of the request to display
 */
function showRequestDetails(requestId) {
    // Simply reuse the operation details modal for now
    showOperationDetails(requestId);
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
 * Confirm deletion of an operation
 * @param {string} operationId - ID of the operation to delete
 */
function confirmDeleteOperation(operationId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta operación?')) {
        // In a real app, this would call your API to delete the operation
        console.log('Deleting operation:', operationId);
        
        // Remove the row from the UI
        const row = document.querySelector(`#operationsTableBody tr[data-id="${operationId}"]`);
        if (row) {
            row.remove();
        }
        
        // Show success message
        alert('Operación eliminada correctamente');
    }
}

/**
 * Retry a failed request
 * @param {string} requestId - ID of the request to retry
 */
function retryFailedRequest(requestId) {
    // In a real app, this would call your API to retry the request
    console.log('Retrying failed request:', requestId);
    
    // Show confirmation message
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
 * Retry a failed operation
 * @param {string} operationId - ID of the operation to retry
 */
function retryFailedOperation(operationId) {
    // In a real app, this would call your API to retry the operation
    console.log('Retrying failed operation:', operationId);
    
    // Show confirmation message
    alert('Reintentando operación fallida...');
    
    // Simulate API call success
    setTimeout(() => {
        // In a real app, the API would handle changing the status to pending
        alert('Operación enviada nuevamente. Estado cambiado a "Pendiente"');
        
        // Reload operations data (would be triggered by API response in real app)
        loadOperationsData();
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