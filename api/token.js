const twilio = require('twilio');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identity } = req.body;

    // Get credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    // Validate required fields
    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials in environment');
      return res.status(500).json({
        error: 'Server configuration error: Missing Twilio credentials',
        details: 'Please check your environment variables'
      });
    }

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
} 