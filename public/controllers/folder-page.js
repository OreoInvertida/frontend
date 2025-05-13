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
        const token = sessionStorage.getItem('auth_token');
        const type = sessionStorage.getItem('token_type') || 'Bearer';
        // Get files from API
        const response = await ApiService.get('/documents/metadata/' + sessionStorage.getItem('user_id'), {
            headers: {
                'Authorization': `${type} ${token}`,
            }
        });
        
        const page = await response.json();
        if (response.status === 200) {
            // Render the files to the grid
            renderDocuments(page.items);
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
    sessionStorage.setItem(doc.id, JSON.stringify(doc));
    
    if (doc.path) {
        docElement.dataset.path = doc.path;
    } else {
        // Set a default path or empty string if not available
        docElement.dataset.path = '';
    }
    // Determine icon based on file type
    const iconSrc = '../resources/icons/file.png';
    
    docElement.innerHTML = `
        <img src="${iconSrc}" alt="Documento" class="document-icon">
        <p>${doc.filename}</p>
    `;
    
    // Add certification badge if certified
    if (doc.signed) {
        docElement.classList.add('certified');
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
    // Create modal HTML using Bootstrap classes
    const modalHTML = `
        <div class="modal fade" id="addDocumentModal" tabindex="-1" aria-labelledby="addDocumentModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addDocumentModalLabel">Agregar Documento</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="upload-form">
                            <div class="mb-3">
                                <label for="document-name" class="form-label">Nombre del documento</label>
                                <input type="text" class="form-control" id="document-name" required>
                            </div>
                            <div class="mb-3">
                                <label for="document-file" class="form-label">Archivo</label>
                                <input type="file" class="form-control" id="document-file" accept=".jpg,.jpeg,.png,.pdf" required>
                                <div class="form-text">Formatos permitidos: .jpg, .jpeg, .png, .pdf</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="upload-button">Subir</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body if it doesn't exist
    if (!document.getElementById('addDocumentModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Get the modal element
    const modalElement = document.getElementById('addDocumentModal');
    
    // Initialize the Bootstrap modal
    const modal = new bootstrap.Modal(modalElement);
    
    // Show the modal
    modal.show();
    
    // Add event listener for upload button
    const uploadButton = document.getElementById('upload-button');
    uploadButton.addEventListener('click', async () => {
        const nameInput = document.getElementById('document-name');
        const fileInput = document.getElementById('document-file');
        
        // Form validation
        if (!nameInput.value.trim()) {
            alert('Por favor ingrese un nombre para el documento');
            return;
        }
        
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Por favor seleccione un archivo');
            return;
        }
        
        const file = fileInput.files[0];
        
        // Check file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            alert('Formato de archivo no válido. Por favor seleccione un archivo .jpg, .jpeg, .png o .pdf');
            return;
        }
        
        try {
            // Show loading state
            uploadButton.disabled = true;
            uploadButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Subiendo...';
            
            // Import folder service
            const { default: FolderService } = await import('../services/folder-service.js');
            
            // Create FormData object
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', nameInput.value.trim());
            
            // Send upload request
            const response = await FolderService.uploadFile(formData);
            
            if (response.success) {
                // Close modal
                modal.hide();
                
                // Refresh document list
                loadDocumentsFromApi();
                
                // Show success message
                alert('Documento subido exitosamente');
            } else {
                alert(response.message || 'Error al subir el documento');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Error al subir el documento: ' + (error.message || 'Error desconocido'));
        } finally {
            // Reset button state
            uploadButton.disabled = false;
            uploadButton.textContent = 'Subir';
        }
    });
    
    // Clean up when modal is hidden
    modalElement.addEventListener('hidden.bs.modal', function() {
        // Remove event listener from upload button to prevent duplicates
        const uploadButton = document.getElementById('upload-button');
        uploadButton.replaceWith(uploadButton.cloneNode(true));
        
        // Reset form
        document.getElementById('upload-form').reset();
    });
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
    
    alert('Próximamente');
}

/**
 * Certify the currently selected document
 */
async function certifySelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para solicitar su certificación');
        return;
    }
    if (selectedDoc.classList.contains('certified')) {
        alert('El documento ya está certificado');
        return;
    }
    const fileid = selectedDoc.dataset.id;
    const filename = selectedDoc.querySelector('p').textContent;
    const filepath = selectedDoc.dataset.path;
    
    try {
        // Show loading state
        const certifyButton = document.querySelector('.tool-button[title="Certificar documento"]');
        certifyButton.innerHTML = '<i class="bi bi-hourglass-split"></i>';
        certifyButton.disabled = true;
        
        // Import folder service
        const { default: FolderService } = await import('../services/folder-service.js');
        
        // Send certification request
        const response = await FolderService.certifyFile(fileid, filename, filepath);
        
        console.log('Certification response:', response);
        
        // Update UI to reflect certification status
        if (response.ok) {
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
        }
        loadDocumentsFromApi();        
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
    alert('Documento transferido');
}

/**
 * Delete the currently selected document
 */
async function deleteSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    const doc = JSON.parse(sessionStorage.getItem(selectedDoc.dataset.id));
    const path = doc.path;
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para eliminar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
        try {
            // Import folder service
            const { default: FolderService } = await import('../services/folder-service.js');
            
            // Call the delete method
            const response = await FolderService.deleteFile(path);
            
            if (response.ok) {
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