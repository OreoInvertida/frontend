/**
 * Folder Page Controller
 * Handles document display and toolbar interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initFolderPage();
});

/**
 * Initialize the folder page components
 */
function initFolderPage() {
    // Setup event listeners for toolbar buttons
    setupToolbarListeners();
    
    // Load documents from API
    loadDocumentsFromApi();
}

/**
 * Load documents from the API
 */
async function loadDocumentsFromApi() {
    try {
        // Import necessary services
        const { default: ApiService } = await import('../services/api-service.js');
        
        // Get files from API
        const response = await ApiService.get('/documents/metadata/' + localStorage.getItem('user_id'), {
            headers: {
                'auth_token': localStorage.getItem('auth_token'),
                'token_type': localStorage.getItem('token_type'),
            }
        });
        
        if (response.success && response.items) {
            // Render the files to the grid
            renderDocuments(response.items);
        } else {
            console.error('Error loading documents:', response);
            // Show error message
            alert('Error al cargar documentos.');
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        alert('Error al cargar documentos.');
    }
}

/**
 * Render documents to the documents grid
 * @param {Array} documents - Array of document objects
 */
function renderDocuments(documents) {
    const documentsGrid = document.querySelector('.documents-grid');
    
    // Clear existing documents
    documentsGrid.innerHTML = '';
    
    // Add each document to the grid
    documents.forEach(doc => {
        const docElement = createDocumentElement(doc);
        documentsGrid.appendChild(docElement);
    });
    
    // Add selection functionality
    addDocumentSelectionListeners();
}

/**
 * Create a document element for the grid
 * @param {Object} doc - Document object
 * @returns {HTMLElement} Document element
 */
function createDocumentElement(doc) {
    const docElement = document.createElement('div');
    docElement.className = 'document-item';
    docElement.dataset.id = doc.id;
    
    // Add certified class if the document is certified
    if (doc.isCertified) {
        docElement.classList.add('certified');
    }
    
    // Determine icon based on file type
    let iconSrc = '../resources/icons/file.png';
    
    docElement.innerHTML = `
        <img src="${iconSrc}" alt="Documento" class="document-icon">
        <p>${doc.name}</p>
    `;
    
    // Add certification badge if certified
    if (doc.isCertified) {
        const badge = document.createElement('span');
        badge.className = 'certified-badge';
        badge.innerHTML = '<i class="bi bi-patch-check-fill"></i>';
        badge.title = 'Documento certificado';
        docElement.appendChild(badge);
    }
    
    return docElement;
}

/**
 * Add event listeners for document selection
 */
function addDocumentSelectionListeners() {
    const documentItems = document.querySelectorAll('.document-item');
    
    documentItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selection from all items
            documentItems.forEach(doc => doc.classList.remove('selected'));
            
            // Add selection to clicked item
            this.classList.add('selected');
        });
    });
}

/**
 * Set up listeners for toolbar buttons
 */
function setupToolbarListeners() {
    // Add document button
    const addButton = document.querySelector('.tool-button[title="Agregar documento"]');
    if (addButton) {
        addButton.addEventListener('click', function() {
            showAddDocumentDialog();
        });
    }
    
    // Download document button
    const downloadButton = document.querySelector('.tool-button[title="Descargar documento"]');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            downloadSelectedDocument();
        });
    }
    
    // Certify document button
    const certifyButton = document.querySelector('.tool-button[title="Certificar documento"]');
    if (certifyButton) {
        certifyButton.addEventListener('click', function() {
            certifySelectedDocument();
        });
    }
    
    // Transfer document button
    const transferButton = document.querySelector('.tool-button[title="Transferir documento"]');
    if (transferButton) {
        transferButton.addEventListener('click', function() {
            transferSelectedDocument();
        });
    }
    
    // Delete document button
    const deleteButton = document.querySelector('.tool-button[title="Eliminar documento"]');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            deleteSelectedDocument();
        });
    }
}

/**
 * Show dialog to add a new document
 */
function showAddDocumentDialog() {
    console.log('Add document dialog');
    // In a real application, this would open a file upload dialog
    alert('Funcionalidad para agregar documento');
}

/**
 * Update the currently selected document
 */
function updateSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para actualizar');
        return;
    }
    
    console.log('Update document:', selectedDoc.dataset.id);
    alert('Funcionalidad para actualizar documento');
}

/**
 * Download the currently selected document
 */
async function downloadSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para descargar');
        return;
    }
    
    const fileId = selectedDoc.dataset.id;
    
    try {
        // Import folder service
        const { default: FolderService } = await import('../services/folder-service.js');
        
        // Call the download method
        await FolderService.downloadFile(fileId);
        console.log('Download document:', fileId);
    } catch (error) {
        console.error('Error downloading document:', error);
        alert('Error al descargar el documento');
    }
}

/**
 * Certify the currently selected document
 */
async function certifySelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para certificar');
        return;
    }
    
    const fileId = selectedDoc.dataset.id;
    const fileName = selectedDoc.querySelector('p').textContent;
    
    try {
        // Show loading state
        const certifyButton = document.querySelector('.tool-button[title="Certificar documento"]');
        const originalIcon = certifyButton.innerHTML;
        certifyButton.innerHTML = '<i class="bi bi-hourglass-split"></i>';
        certifyButton.disabled = true;
        
        // Import folder service
        const { default: FolderService } = await import('../services/folder-service.js');
        
        console.log(`Sending certification request for file ID: ${fileId}, name: ${fileName}`);
        
        // Send certification request
        const response = await FolderService.certifyFile(fileId, fileName);
        
        console.log('Certification response:', response);
        
        // Update UI to reflect certification status
        if (response.isCertified) {
            // Add certification visual indicator
            selectedDoc.classList.add('certified');
            // Add a small badge or icon to indicate certification
            if (!selectedDoc.querySelector('.certified-badge')) {
                const badge = document.createElement('span');
                badge.className = 'certified-badge';
                badge.innerHTML = '<i class="bi bi-patch-check-fill"></i>';
                badge.title = 'Documento certificado';
                selectedDoc.appendChild(badge);
            }
        } else {
            // Remove certification visual indicator
            selectedDoc.classList.remove('certified');
            // Remove the badge if it exists
            const badge = selectedDoc.querySelector('.certified-badge');
            if (badge) {
                badge.remove();
            }
        }
        
        // Show success message
        alert(response.message);
        
    } catch (error) {
        console.error('Error certifying document:', error);
        alert(error.data?.message || 'Error al certificar el documento');
    } finally {
        // Restore button state
        const certifyButton = document.querySelector('.tool-button[title="Certificar documento"]');
        certifyButton.innerHTML = '<i class="bi bi-check-circle"></i>';
        certifyButton.disabled = false;
    }
}

/**
 * Transfer the currently selected document
 */
function transferSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para transferir');
        return;
    }
    
    console.log('Transfer document:', selectedDoc.dataset.id);
    alert('Funcionalidad para transferir documento');
}

/**
 * Delete the currently selected document
 */
async function deleteSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para eliminar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
        try {
            const fileId = selectedDoc.dataset.id;
            
            // Import folder service
            const { default: FolderService } = await import('../services/folder-service.js');
            
            // Call the delete method
            const response = await FolderService.deleteFile(fileId);
            
            if (response.success) {
                // Remove from UI
                selectedDoc.remove();
            } else {
                alert('Error al eliminar el documento');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error al eliminar el documento');
        }
    }
}