const express = require('express')
const bodyParser = require('body-parser')
const apiRequest = require('./backend')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 8080
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.json());

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
})

app.get('/documents/metadata/:user_id', async (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log('Headers recibidos desde el navegador →', req.headers);  // 👈 Añade esto
  console.log('Auth Headerr recibido desde el navegador →', req.headers['authorization']);  // 👈 Añade esto
  try {
    
    const response = await apiRequest(`/documents/metadata/${req.params.user_id}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader
      }
    });
    
    const data = await response.json();
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Metadata error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
})


// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, req.params.filename)
  }
})

const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
    // Check file type if needed
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, png, and pdf files are allowed.'));
    }
  }})

// Modified route to handle file uploads
app.put('/documents/doc/:user_id/:filename', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create form data for the API request
    const payload = new FormData();
    // Add file to form data
    const file = await fs.openAsBlob(req.file.path);
    payload.set('file', file, req.params.filename);
    // Make API request
    const response = await apiRequest(`/documents/doc/${req.params.user_id}/${req.params.filename}`, {
      auth_token: req.headers['auth_token'],
      token_type: req.headers['token_type'],
      method: 'PUT',
      body: payload,
    });
    
    const data = await response.json();
    
    // Clean up temp file
    fs.unlinkSync(req.file.path);
    
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
})

app.post('/document/certify', async (req, res) => {
  try {
    const response = await apiRequest('/orchestrator/authenticate_doc', {
      auth_token: req.headers['auth_token'],
      token_type: req.headers['token_type'],
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('¡Bendito sea! ', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
})

app.delete('/documents/:userid/:filename', async (req, res) => {
  try {
    const response = await apiRequest(`/documents/doc/${req.params.userid}/${req.params.filename}`, {
      auth_token: req.headers['auth_token'],
      token_type: req.headers['token_type'],
      method: 'DELETE',
    });
    
    const data = await response.json();
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
})

app.post('/transfers/share_doc', async (req, res) => {
  try {
    const truebody = req.body;
    const authHeader = req.headers['authorization'];
    console.log('→ Transfer POST recibido desde front:');
    console.log(req.body.user_id);
    console.log(req.body.document_path);
    console.log(req.body.recipient_email);
    const response = await apiRequest('/transfers/share_doc', {
      method: 'POST',
      body: JSON.stringify({
          "user_id" : req.body.user_id,
          "document_path" : req.body.document_path,
          "recipient_email": req.body.recipient_email
      }),
      headers: {
        'Authorization': authHeader
      },
      
    });

    console.log('→ Transfer POST recibido desde back:');
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Transfer proxy error:', JSON.stringify(error, null, 2));
    console.error('Transfer proxy error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Error al transferir documento'
    });
  }
});

app.post('/transfers/outgoing', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('→ Transfer USER recibido desde front:');
    console.log(req.body);

    const response = await apiRequest('/transfers/outgoing', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: JSON.stringify({
          "user_id" : req.body.user_id,
          "operator_name" : "Operador Marcianos",
          "operator_id": "681466aaedee130015720b44",
          "destination_url" : "https://api.marcianos.me/api/transferCitizen"
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Transfer USER error:', JSON.stringify(error, null, 2));
    return res.status(error.status || 500).json({
      message: error.message || 'Error al solicitar transferencia'
    });
  }
});



app.get('/operators', async (req, res) => {
  try {
    const response = await apiRequest('/orchestrator/operators', {
      auth_token: req.headers['auth_token'],
      token_type: req.headers['token_type'],
      method: 'GET',
    });
    
    const data = await response.json();
    // Forward the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Operators error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error'
    });
  }
}
)
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

