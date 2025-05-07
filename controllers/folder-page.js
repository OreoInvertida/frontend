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
    // Mock data - would be replaced with API call
    const documents = [
        { id: 1, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 2, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 3, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 4, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 5, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 6, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 7, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 8, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 9, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 10, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 11, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 12, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 13, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 14, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 15, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 16, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 17, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 18, name: 'Documento-2.pdf', type: 'application/pdf' },
        { id: 19, name: 'Cédula.jpg', type: 'image/jpeg' },
        { id: 20, name: 'Documento-1.pdf', type: 'application/pdf' },
        { id: 21, name: 'Documento-2.pdf', type: 'application/pdf' }
    ];
    
    // Setup event listeners for toolbar buttons
    setupToolbarListeners();
    
    // Load documents to the grid
    renderDocuments(documents);
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
    
    // Determine icon based on file type
    let iconSrc = '../resources/icons/file.png';
    
    docElement.innerHTML = `
        <img src="${iconSrc}" alt="Documento" class="document-icon">
        <p>${doc.name}</p>
    `;
    
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
    
    // Update document button
    const updateButton = document.querySelector('.tool-button[title="Actualizar documento"]');
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            updateSelectedDocument();
        });
    }
    
    // Download document button
    const downloadButton = document.querySelector('.tool-button[title="Descargar documento"]');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            downloadSelectedDocument();
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
function downloadSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para descargar');
        return;
    }
    
    console.log('Download document:', selectedDoc.dataset.id);
    alert('Funcionalidad para descargar documento');
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
function deleteSelectedDocument() {
    const selectedDoc = document.querySelector('.document-item.selected');
    
    if (!selectedDoc) {
        alert('Por favor selecciona un documento para eliminar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
        console.log('Delete document:', selectedDoc.dataset.id);
        selectedDoc.remove();
    }
}