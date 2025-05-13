/**
 * Folder Page Controller
 * Handles document display and toolbar interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    console.log('→ DOMContentLoaded triggered');
    initFolderPage();
});

/**
 * Initialize the folder page components
 */
function initFolderPage() {
    console.log('→ initFolderPage ejecutado');
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
        docElement.dataset.filename = doc.filename
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
    console.log('→ setupToolbarListeners llamado');
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
        console.log('→ Botón de transfer encontrado');
        transferButton.addEventListener('click', function () {
            console.log('→ Clic en transfer recibido');
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

function showTransferDocumentDialog(selectedDoc) {
    console.log('→ Mostrando modal para:', selectedDoc.dataset.path);
    const modalHTML = `
    <div class="modal fade" id="transferDocumentModal" tabindex="-1" aria-labelledby="transferDocumentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="transferDocumentModalLabel">Transferir Documento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="transfer-form">
                        <div class="mb-3">
                            <label for="recipient-email" class="form-label">Correo del destinatario</label>
                            <input type="email" class="form-control" id="recipient-email" required>
                        </div>
                        <p class="small text-muted">Documento seleccionado: <strong>${selectedDoc.querySelector('p').textContent}</strong></p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="send-transfer-button">Enviar</button>
                </div>
            </div>
        </div>
    </div>`;

    if (!document.getElementById('transferDocumentModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modalElement = document.getElementById('transferDocumentModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    document.getElementById('send-transfer-button').addEventListener('click', async () => {
        const emailInput = document.getElementById('recipient-email');
        const email = emailInput.value.trim();
        const documentPath = selectedDoc.dataset.path;
        const userId = sessionStorage.getItem('user_id');

        if (!email) {
            alert('Por favor ingresa un correo válido');
            return;
        }

        try {
            document.getElementById('send-transfer-button').innerHTML =
              '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            const testbody = {
                    user_id: parseInt(userId),
                    document_path: documentPath,
                    recipient_email: email
                }
            console.log('Transfer request body:', testbody);
            const response = await fetch('/transfers/share_doc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${sessionStorage.getItem('token_type')} ${sessionStorage.getItem('auth_token')}`
                },
                body: {
                    user_id: parseInt(userId),
                    document_path: documentPath,
                    recipient_email: email
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Documento transferido exitosamente.');
                modal.hide();
            } else {
                console.error('Transfer failed:', result);
                alert(result.message || 'Error al transferir el documento.');
            }
        } catch (err) {
            console.error('Transfer error:', err);
            alert('Error al transferir el documento.');
        } finally {
            document.getElementById('send-transfer-button').textContent = 'Enviar';
        }
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        const button = document.getElementById('send-transfer-button');
        button.replaceWith(button.cloneNode(true));
        document.getElementById('transfer-form').reset();
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
    

    const filepath = selectedDoc.dataset.path
    const filename = selectedDoc.dataset.filename

     // Import folder service
     const { default: FolderService } = await import('../services/folder-service.js');
        
     // Send certification request
    const response =   await FolderService.downloadFile(filepath);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

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
    console.log('→ Ejecutando transferSelectedDocument');
    const selectedDoc = document.querySelector('.document-item.selected');

    if (!selectedDoc) {
        alert('Por favor selecciona un documento para transferir');
        return;
    }

    showTransferDocumentDialog(selectedDoc);
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