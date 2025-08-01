# Standalone Twilio WebRTC Call App

A simple, standalone application for making WebRTC calls through Twilio without complex webhook configurations.

## Features

- ✅ **Dual Mode Support**: Use server-generated tokens OR bring your own
- ✅ **Tabbed Interface**: Easy switching between server and manual modes
- ✅ Direct WebRTC calling to any phone number
- ✅ No complex webhook setup required
- ✅ Real-time call status updates
- ✅ Connection quality indicators
- ✅ Clean, modern UI with intuitive tabs

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Twilio Credentials

1. Copy the configuration template:
   ```bash
   cp config-template.txt .env
   ```

2. Edit `.env` file with your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_API_KEY=your_api_key_here  # Optional but recommended
   TWILIO_API_SECRET=your_api_secret_here  # Optional but recommended
   PORT=3000
   ```

### 3. Get Your Twilio Credentials

From your [Twilio Console](https://console.twilio.com):

- **Account SID**: Found on your dashboard
- **Auth Token**: Found on your dashboard (click to reveal)
- **API Key/Secret** (recommended): Go to Settings > API Keys > Create New API Key

### 4. Start the Application

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 5. Open in Browser

Navigate to: `http://localhost:3000`

## How to Use

The app provides two modes of operation:

### **Tab 1: Use Our Server** (Recommended)
1. **Configure .env**: Add your Twilio credentials to the `.env` file
2. **Set Phone Numbers**: Enter your Twilio number and personal number
3. **Initialize**: Click "Get Token & Initialize" 
4. **Make a Call**: Click "Call" to connect

### **Tab 2: Manual Token** (Advanced)
1. **Generate Token**: Create your own Twilio access token
2. **Enter Token**: Paste your access token in the token field
3. **Set Phone Numbers**: Enter your Twilio number and personal number  
4. **Initialize**: Click "Initialize with Token"
5. **Make a Call**: Click "Call" to connect

### **Common Steps**
- **End Call**: Click "Hang Up" to end any active call
- **Switch Modes**: Click the tabs to switch between server and manual modes

## Troubleshooting

### "Failed to get access token"
- Check your `.env` file has correct Twilio credentials
- Ensure your server is running on the correct port
- Check browser console for detailed error messages

### "Device not ready"
- Wait for "Device Ready" status before calling
- Check your internet connection
- Verify Twilio credentials are valid

### "Call failed"
- Ensure phone numbers are in E.164 format (+1234567890)
- Check that your Twilio account has sufficient balance
- Verify the "From" number is a valid Twilio phone number you own

## Architecture

This app uses a simplified architecture:

1. **Frontend** (`index.html`): Handles UI and WebRTC calling
2. **Backend** (`server.js`): Generates access tokens and manages API calls
3. **No Webhooks**: Eliminates complex TwiML application configuration

## Security Notes

- Never expose your Twilio Auth Token in frontend code
- Use API Keys instead of Auth Token for production
- Consider implementing rate limiting for the token endpoint
- Add proper authentication for production use

## API Endpoints

- `POST /token` - Generate access token for WebRTC client
- `POST /make-call` - Make outbound call via Twilio API
- `GET /health` - Health check endpoint

## File Structure

```
├── server.js              # Express backend server
├── package.json           # Node.js dependencies
├── config-template.txt    # Environment configuration template
├── index.html             # Frontend application
└── README.md             # This file
```

---

**Need help?** Check the browser console for detailed error messages, or review your Twilio Console for account status and phone number configurations.