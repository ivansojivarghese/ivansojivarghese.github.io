
// lightflare-webhook.js
exports.handler = async (req, res) => { //
    try {
      // 1. Get the webhook data from the request body
      const data = JSON.parse(req.body);
  
      // 2. Process the webhook data (e.g., extract relevant information)
      const messageTitle = data.title;
      const messageBody = data.description;
  
      // 3. Do something with the data (e.g., send a push notification)
      // ... (You'll need to integrate with your push notification service here)
  
      // 4. Send a success response to Lightflare
      res.status(200).json({ message: 'Webhook received successfully' });
    } catch (error) {
      // 5. Handle errors gracefully
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  };
  