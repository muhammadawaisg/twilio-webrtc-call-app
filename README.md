# Standalone Twilio WebRTC Call App

A completely standalone application for making WebRTC calls through Twilio. **No .env files or server configuration needed!** Users enter their Twilio credentials directly in the web interface.

## Features

- ✅ **No server configuration** - Enter credentials in web UI
- ✅ Direct WebRTC calling to any phone number  
- ✅ Works with existing Twilio TwiML Apps
- ✅ Real-time call status updates
- ✅ Connection quality indicators
- ✅ Clean, modern UI
- ✅ Credentials saved locally (except Auth Token for security)

## Super Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 3. Open in Browser

Navigate to: `http://localhost:3000`

### 4. Enter Your Twilio Credentials

1. **Get credentials** from [Twilio Console](https://console.twilio.com):
   - **Account SID**: Found on your dashboard
   - **Auth Token**: Found on your dashboard (click to reveal)

2. **Enter in web interface**:
   - Paste Account SID and Auth Token
   - Set your Twilio phone number
   - Set your personal number
   - Click "Initialize Device"
   - Click "Call" to connect!

## How to Use

1. **Enter Twilio Credentials**: 
   - Get Account SID and Auth Token from [Twilio Console](https://console.twilio.com)
   - Enter them in the web interface

2. **Set Phone Numbers**: 
   - "Phone Number to Call": Your Twilio number (e.g., +13136311821)
   - "Your Personal Number": Your actual phone number (e.g., +923164203806)

3. **Initialize Device**: Click "Initialize Device" to set up the WebRTC connection

4. **Make a Call**: Click "Call" to connect to your Twilio number

5. **End Call**: Click "Hang Up" to end the call

## Troubleshooting

### "Failed to get access token"
- Check that you entered correct Twilio Account SID and Auth Token
- Verify credentials from [Twilio Console](https://console.twilio.com)
- Check browser console for detailed error messages

### "Device not ready"
- Wait for "Device Ready" status before calling
- Check your internet connection
- Verify Twilio credentials are valid and have sufficient balance

### "Call failed"
- Ensure phone numbers are in E.164 format (+1234567890)
- Check that your Twilio account has sufficient balance
- Verify your Twilio number is active and configured

## Architecture

This app uses a completely standalone architecture:

1. **Frontend** (`public/index.html`): Handles UI, credentials, and WebRTC calling
2. **Backend** (`server.js`): Generates access tokens using user-provided credentials
3. **No Configuration Files**: Everything is entered through the web interface
4. **No Environment Setup**: No .env files or server configuration needed

## Security Notes

- ✅ Auth Token is never saved to localStorage for security
- ✅ Account SID is saved locally for convenience (non-sensitive)
- ✅ All credentials are sent securely to backend for token generation
- ✅ No credentials are stored on the server
- 🔒 For production: Add HTTPS and consider rate limiting

## API Endpoints

- `POST /token` - Generate access token for WebRTC client
- `POST /make-call` - Make outbound call via Twilio API
- `GET /health` - Health check endpoint

## File Structure

```
├── server.js              # Express backend server
├── package.json           # Node.js dependencies  
├── public/
│   └── index.html        # Frontend application
└── README.md             # This file
```

---

**Need help?** 
- Check the browser console for detailed error messages
- Verify your Twilio credentials at [Twilio Console](https://console.twilio.com)
- Make sure your Twilio account has sufficient balance
- Ensure your Twilio number is active and properly configured