const express = require('express');
const port = 3000;

var cors = require('cors');
// Import the endpoint manager
const endpointHandlers = require('./src/endpoint/endpointHandlers');
var app = express()

app.use(cors())
app.use(express.json());

app.use('/api', endpointHandlers);

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))