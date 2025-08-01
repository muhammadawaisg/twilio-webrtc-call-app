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
}