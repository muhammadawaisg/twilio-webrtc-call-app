const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root directory

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

// Log configuration status (without exposing sensitive data)
console.log('Twilio Configuration Status:');
console.log('- Account SID:', accountSid ? `${accountSid.substring(0, 8)}...` : 'MISSING');
console.log('- Auth Token:', authToken ? 'SET' : 'MISSING');
console.log('- API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Using Auth Token');
console.log('- API Secret:', apiSecret ? 'SET' : 'Using Auth Token');

// For outbound calls, we don't need a TwiML app - we can use the API directly
// Only initialize client if credentials are available
let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.log('⚠️ Twilio client initialization failed:', error.message);
  }
} else {
  console.log('⚠️ Twilio client not initialized - missing credentials');
}

// Generate access token for WebRTC client
app.post('/token', (req, res) => {
  console.log('Token request received');

  // Check if credentials are available
  if (!accountSid || !authToken) {
    console.error('Missing Twilio credentials');
    return res.status(500).json({
      error: 'Server configuration error: Missing Twilio credentials',
      details: 'Please check your .env file'
    });
  }

  try {
    const { identity } = req.body;
    const clientIdentity = identity || 'web-client-' + Date.now();

    console.log('Generating token for identity:', clientIdentity);

    // Create access token
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const accessToken = new AccessToken(
      accountSid,
      apiKey || accountSid,
      apiSecret || authToken,
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

// Make outbound call endpoint
app.post('/make-call', async (req, res) => {
  try {
    const { to, from } = req.body;

    if (!to || !from) {
      return res.status(400).json({ error: 'Both "to" and "from" numbers are required' });
    }

    if (!client) {
      return res.status(500).json({
        error: 'Twilio client not available',
        message: 'Please check your .env configuration'
      });
    }

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