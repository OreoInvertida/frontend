import OperationsService from '../services/operations-service.js';
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
async function loadRequestsData() {
    try {
        // Show loading state
        const requestsTableBody = document.getElementById('requestsTableBody');
        if (!requestsTableBody) return;
        requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando solicitudes...</td></tr>';
        
        // Get requests data from the service
        const response = await OperationsService.getIncomingRequests();
        
        // Clear the table
        requestsTableBody.innerHTML = '';
        
        if (!response.success || !response.requests || response.requests.length === 0) {
            requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay solicitudes disponibles</td></tr>';
            return;
        }
        
        // Populate the table with the requests
        response.requests.forEach(req => {
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
    } catch (error) {
        console.error('Error loading requests data:', error);
        const requestsTableBody = document.getElementById('requestsTableBody');
        if (requestsTableBody) {
            requestsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar las solicitudes</td></tr>';
        }
    }
}

/**
 * Load operations data into the operations table
 */
async function loadOperationsData() {
    try {
        // Show loading state
        const operationsTableBody = document.getElementById('operationsTableBody');
        if (!operationsTableBody) return;
        operationsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando operaciones...</td></tr>';
        
        // Get operations data from the service
        const response = await OperationsService.getOutgoingOperations();
        
        // Clear the table
        operationsTableBody.innerHTML = '';
        
        if (!response.success || !response.operations || response.operations.length === 0) {
            operationsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay operaciones disponibles</td></tr>';
            return;
        }
        
        // Populate the table with the operations
        response.operations.forEach(op => {
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
    } catch (error) {
        console.error('Error loading operations data:', error);
        const operationsTableBody = document.getElementById('operationsTableBody');
        if (operationsTableBody) {
            operationsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar las operaciones</td></tr>';
        }
    }
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
async function showOperationDetails(operationId) {
    try {
        // Get operation details from the service
        const response = await OperationsService.getOperationDetails(operationId);
        
        if (!response.success || !response.operation) {
            alert('No se pudieron cargar los detalles de la operación');
            return;
        }
        
        const operationDetails = response.operation;
        
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
    } catch (error) {
        console.error('Error loading operation details:', error);
        alert('Error al cargar los detalles de la operación');
    }
}

/**
 * Handle the submission of a document request
 */
async function submitDocumentRequest() {
    const requestType = document.getElementById('requestType').value;
    const requestEntity = document.getElementById('requestEntity').value;
    const requestNotes = document.getElementById('requestNotes').value;
    
    if (!requestType || !requestEntity) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    try {
        // Submit request data to the service
        const response = await OperationsService.submitDocumentRequest({
            requestType,
            requestEntity,
            requestNotes
        });
        
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById('requestDocumentModal')).hide();
        
        // Show success message
        alert(response.message || 'Solicitud enviada correctamente');
        
        // Reload requests data
        loadRequestsData();
    } catch (error) {
        console.error('Error submitting document request:', error);
        alert('Error al enviar la solicitud: ' + (error.data?.message || 'Error desconocido'));
    }
}

/**
 * Handle the confirmation of a document receipt
 */
async function confirmDocumentReceive() {
    const receiveCode = document.getElementById('receiveCode').value;
    const receiveNotes = document.getElementById('receiveNotes').value;
    
    if (!receiveCode) {
        alert('Por favor ingresa el código de recepción');
        return;
    }
    
    try {
        // Submit receipt confirmation to the service
        const response = await OperationsService.confirmDocumentReceipt({
            receiveCode,
            receiveNotes
        });
        
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById('receiveDocumentModal')).hide();
        
        // Show success message
        alert(response.message || 'Recepción confirmada correctamente');
        
        // Reload operations data
        loadOperationsData();
    } catch (error) {
        console.error('Error confirming document receipt:', error);
        alert('Error al confirmar la recepción: ' + (error.data?.message || 'Error desconocido'));
    }
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
async function confirmDeleteRequest(requestId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
        try {
            // Delete the request via the service
            await OperationsService.deleteRequest(requestId);
            
            // Remove the row from the UI
            const row = document.querySelector(`#requestsTableBody tr[data-id="${requestId}"]`);
            if (row) {
                row.remove();
            }
            
            // Show success message
            alert('Solicitud cancelada correctamente');
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Error al eliminar la solicitud: ' + (error.data?.message || 'Error desconocido'));
        }
    }
}

/**
 * Confirm deletion of an operation
 * @param {string} operationId - ID of the operation to delete
 */
async function confirmDeleteOperation(operationId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta operación?')) {
        try {
            // Delete the operation via the service
            await OperationsService.deleteOperation(operationId);
            
            // Remove the row from the UI
            const row = document.querySelector(`#operationsTableBody tr[data-id="${operationId}"]`);
            if (row) {
                row.remove();
            }
            
            // Show success message
            alert('Operación eliminada correctamente');
        } catch (error) {
            console.error('Error deleting operation:', error);
            alert('Error al eliminar la operación: ' + (error.data?.message || 'Error desconocido'));
        }
    }
}

/**
 * Retry a failed request
 * @param {string} requestId - ID of the request to retry
 */
async function retryFailedRequest(requestId) {
    try {
        // Show confirmation message
        alert('Reintentando solicitud fallida...');
        
        // Retry the request via the service
        const response = await OperationsService.retryRequest(requestId);
        
        // Show success message
        alert(response.message || 'Solicitud enviada nuevamente. Estado cambiado a "Pendiente"');
        
        // Reload requests data
        loadRequestsData();
    } catch (error) {
        console.error('Error retrying request:', error);
        alert('Error al reintentar la solicitud: ' + (error.data?.message || 'Error desconocido'));
    }
}

/**
 * Retry a failed operation
 * @param {string} operationId - ID of the operation to retry
 */
async function retryFailedOperation(operationId) {
    try {
        // Show confirmation message
        alert('Reintentando operación fallida...');
        
        // Retry the operation via the service
        const response = await OperationsService.retryOperation(operationId);
        
        // Show success message
        alert(response.message || 'Operación enviada nuevamente. Estado cambiado a "Pendiente"');
        
        // Reload operations data
        loadOperationsData();
    } catch (error) {
        console.error('Error retrying operation:', error);
        alert('Error al reintentar la operación: ' + (error.data?.message || 'Error desconocido'));
    }
}

/**
 * Search for entities/users based on input
 * @param {string} query - Search query
 */
async function searchEntities(query) {
    try {
        if (!query || query.length < 3) {
            document.getElementById('entityResults').classList.add('d-none');
            return;
        }
        
        // Search for entities via the service
        const response = await OperationsService.searchEntities(query);
        
        // Display results
        const resultsContainer = document.getElementById('entityResults');
        resultsContainer.innerHTML = '';
        
        if (!response.success || !response.entities || response.entities.length === 0) {
            resultsContainer.innerHTML = '<div class="entity-item">No se encontraron resultados</div>';
        } else {
            response.entities.forEach(entity => {
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
    } catch (error) {
        console.error('Error searching for entities:', error);
        // Don't show an alert for search errors to not interrupt the user
        document.getElementById('entityResults').classList.add('d-none');
    }
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
    const status = row.querySelector('td:nth-child(5) .status-badge').textContent;
    console.log(`Row selected: ${document} (${requestId}) - Status: ${status}`);
}