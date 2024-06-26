
// app.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Endpoint to handle incoming webhook POST requests
app.post('/webhook-endpoint', (req, res) => {
  // Extract the webhook payload (assuming JSON format)
  const payload = req.body;

  // Process the webhook payload here (e.g., log it)
  console.log('Received webhook payload:', payload);

  // Optionally, send a response back to the webhook provider
  res.status(200).send('Webhook received successfully');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
