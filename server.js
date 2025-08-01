const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Twilio configuration (now handled per-request from frontend)
console.log('🚀 Twilio WebRTC Server - Ready to accept user credentials from frontend');

// Generate access token for WebRTC client
app.post('/token', (req, res) => {
  console.log('Token request received');

  try {
    const { identity, accountSid, authToken } = req.body;

    // Validate required fields
    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials in request');
      return res.status(400).json({
        error: 'Missing credentials',
        details: 'Please provide accountSid and authToken'
      });
    }

    const clientIdentity = identity || 'web-client-' + Date.now();

    console.log('Generating token for identity:', clientIdentity);
    console.log('Using Account SID:', accountSid.substring(0, 8) + '...');

    // Create access token with user-provided credentials
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const accessToken = new AccessToken(
      accountSid,
      accountSid,  // Use accountSid as API key for simplicity
      authToken,   // Use authToken as API secret
      { identity: clientIdentity }
    );

    // Grant voice capabilities for outgoing calls
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: 'AP19e511cbd5d24c8419b502cee9212ae2', // Your existing TwiML App
      incomingAllow: false, // Only outgoing calls
    });

    accessToken.addGrant(voiceGrant);

    const jwt = accessToken.toJwt();
    console.log('Token generated successfully');

    res.json({
      token: jwt,
      identity: clientIdentity
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      error: 'Failed to generate token',
      details: error.message
    });
  }
});

// Make outbound call endpoint (optional - for future use)
app.post('/make-call', async (req, res) => {
  try {
    const { to, from, accountSid, authToken } = req.body;

    if (!to || !from || !accountSid || !authToken) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Need: to, from, accountSid, authToken'
      });
    }

    // Create Twilio client with user credentials
    const client = twilio(accountSid, authToken);

    // Make call using Twilio API
    const call = await client.calls.create({
      to: to,
      from: from,
      // Simple TwiML to connect the call
      twiml: `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">Connecting your call...</Say>
          <Dial timeout="30">${to}</Dial>
        </Response>
      `
    });

    res.json({
      success: true,
      callSid: call.sid,
      status: call.status
    });
  } catch (error) {
    console.error('Error making call:', error);
    res.status(500).json({
      error: 'Failed to make call',
      message: error.message
    });
  }
});

// Local TwiML webhook for handling calls
app.post('/webhook/voice', (req, res) => {
  console.log('Voice webhook called:', req.body);

  const { To, From, Caller } = req.body;

  // Simple TwiML that allows the call to connect
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Call connecting to ${To}. Please wait.</Say>
    <Dial timeout="30" record="false">
        <Number>${To}</Number>
    </Dial>
</Response>`;

  res.type('text/xml');
  res.send(twiml);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Twilio WebRTC server running on port ${port}`);
  console.log(`Access the app at: http://localhost:${port}`);
});