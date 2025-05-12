const express = require('express')
const bodyParser = require('body-parser')
const apiRequest = require('./backend')

const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(express.static('public'))

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
  try {
    const response = await apiRequest(`/documents/metadata/${req.params.user_id}`, {
      auth_token: req.headers['auth_token'],
      token_type: req.headers['token_type'],
      method: 'GET',
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


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

