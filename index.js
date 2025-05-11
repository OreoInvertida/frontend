const express = require('express')
const apiRequest = require('./backend')

const app = express()
const port = 3000

app.use(express.static('public'))

// Login
app.post('/auth/login', (req, res) => {

  return apiRequest('/auth/login', {
      headers: req.headers,
      method: 'POST',
      body: req.body,
    });
})




app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

