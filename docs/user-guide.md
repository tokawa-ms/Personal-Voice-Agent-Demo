# Personal Voice Agent Demo - User Guide

## Getting Started

This application allows you to interact with an AI agent using Azure Personal Voice technology. You can communicate through text or voice, and the agent will respond using a personalized voice.

## Prerequisites

Before using this application, you need to prepare the following Azure resources:

### 1. Azure Speech Service
- Create an Azure Speech Service resource
- Note the **Region** (e.g., eastus, japaneast)
- Note the **API Key**

### 2. Azure Personal Voice
- Create a Personal Voice profile in Azure Speech Studio
- Note the **Speaker Profile ID**

### 3. Azure AI Foundry Agent Service
- Create a project in Azure AI Foundry
- Create and configure an Agent
- Note the **Project Endpoint** URL
- Note the **Agent ID**
- Generate an **Entra ID Token** for authentication

## Initial Setup

### Step 1: Open the Application

Open `src/index.html` in a modern web browser (Chrome, Edge, Firefox, or Safari).

### Step 2: Configure Azure Services

When you first open the application, you'll see the configuration panel at the top.

The configuration is organized into three sections for clarity:

#### Speech Service Section (Blue)
Contains all settings related to Azure Speech Service and Personal Voice:

1. **Speech Service Region**: Your Azure Speech Service region (e.g., `eastus`)
2. **Speech Service Key**: Your Speech Service API key
3. **Personal Voice Speaker Profile ID**: The ID of your Personal Voice profile
4. **Language**: The language for speech recognition and synthesis (e.g., `en-US`, `ja-JP`, `en-GB`)
5. **Personal Voice Model**: Select the voice model to use (`DragonLatestNeural` or `PhoenixLatestNeural`)

#### AI Foundry Section (Green)
Contains settings for Azure AI Foundry Agent Service:

6. **AI Foundry Project Endpoint**: Your AI Foundry project endpoint URL
7. **Agent ID**: Your Agent ID from AI Foundry

#### Entra ID Section (Purple)
Contains authentication settings:

8. **Entra ID Token**: Your authentication bearer token

### Step 3: Test Connection

Click the **Test Connection** button to verify your configuration.

- ✅ If successful, you'll see a "Connection successful!" message
- ❌ If failed, check your settings and try again

### Step 4: Save Configuration

Click **Save & Close** to save your settings and close the configuration panel.

Your settings will be saved in browser storage and automatically loaded next time you open the application.

## Using the Application

### Customizing the Agent Avatar

The left side of the screen shows the agent's avatar.

#### Upload Background Image
1. Click **Upload Background Image**
2. Select an image file from your computer
3. The image will be displayed as the background

#### Upload Avatar Image
1. Click **Upload Avatar Image**
2. Select an image file from your computer
3. The image will be displayed over the background

#### Clear Images
Click **Clear Images** to remove all uploaded images and return to the default icon.

**Note**: Uploaded images are saved in browser storage and will persist across sessions.

### Chatting with the Agent

The right side of the screen is the conversation interface.

#### Text Input

1. Type your message in the text input box
2. Click **Send** or press **Enter** to send
3. The agent will process your message and respond
4. The response will be displayed in the chat and spoken using Personal Voice

#### Voice Input

1. Click the **microphone icon** to start voice recognition
2. Speak your message (the button will turn red and pulse)
3. When you finish speaking, the recognized text will be automatically sent
4. Click the microphone icon again to stop voice recognition

#### Status Indicators

- 🎤 **Listening...**: The application is actively listening to your voice
- ⏳ **Processing...**: Your message is being processed by the agent
- 🔊 **Speaking...**: The agent's response is being synthesized and played

### Managing Conversations

#### Clear Session

Click **Clear Session** to:
- Clear all messages from the screen
- Create a new conversation thread
- Start fresh with the agent

You will be asked to confirm before clearing.

## Tips and Best Practices

### Voice Recognition

- Speak clearly and at a moderate pace
- Ensure you're in a quiet environment for best results
- The system uses continuous recognition, so you can speak naturally
- Wait for the system to process before speaking again

### Personal Voice Quality

- The quality of synthesized speech depends on your Personal Voice profile
- Select the appropriate voice model (`DragonLatestNeural` or `PhoenixLatestNeural`) based on your preference
- Different languages may have different voice characteristics
- Ensure you select the correct language matching your Personal Voice profile

### Image Upload

- Supported formats: JPEG, PNG, GIF, WebP
- Recommended size: Under 5MB for best performance
- Images are stored in browser storage (Base64 encoded)
- Clear images if you need to free up browser storage

### Connection Issues

If you experience connection problems:

1. Check your internet connection
2. Verify all API keys and endpoints are correct
3. Ensure your Entra ID token hasn't expired (generate a new one if needed)
4. Check browser console for detailed error messages

### Browser Storage

The application stores data locally in your browser:
- Configuration settings
- Uploaded images
- No conversation history is stored (for privacy)

To reset everything:
1. Open browser developer tools (F12)
2. Go to Application → Local Storage
3. Delete items with keys starting with `pva_`

## Troubleshooting

### Problem: Configuration panel won't close

**Solution**: Make sure you've clicked "Save & Close" or successfully tested the connection with auto-close enabled.

### Problem: Microphone doesn't work

**Solution**: 
- Check browser permissions for microphone access
- For local development, some browsers require HTTPS for microphone access
- Grant microphone permission when prompted

### Problem: No sound is played

**Solution**:
- Check your system volume
- Ensure Speaker Profile ID is correctly configured
- Verify the Personal Voice Model (DragonLatestNeural or PhoenixLatestNeural) is selected
- Verify the language setting matches your Personal Voice profile
- Check browser console for synthesis errors

### Problem: Agent doesn't respond

**Solution**:
- Verify Agent Service connection settings
- Check if Entra ID token is valid (tokens expire)
- Ensure the Agent ID is correct
- Check browser console for API errors

### Problem: Images don't load after refresh

**Solution**:
- Check if browser storage is enabled
- Verify storage quota hasn't been exceeded
- Try re-uploading the images

## Advanced Features

### Keyboard Shortcuts

- **Enter**: Send message (when text input is focused)
- **Esc**: Stop voice recognition (if active)

### Browser Compatibility

Tested and supported on:
- Google Chrome 90+
- Microsoft Edge 90+
- Mozilla Firefox 88+
- Safari 14+

### Mobile Support

The application is responsive and works on mobile devices, but:
- Voice recognition may have varying support across mobile browsers
- Larger images may impact performance on mobile devices
- Some features work best on desktop browsers

## Privacy and Security

### Data Storage

- All configuration data is stored **locally** in your browser
- No data is sent to servers except Azure API calls
- Conversation history is **not persisted** (only shown during the session)

### API Keys and Tokens

- Never share your API keys or tokens
- Tokens should have minimal required permissions
- Consider using short-lived tokens for enhanced security
- This is a demo application - for production, implement secure authentication

### Clearing Data

To remove all stored data:
1. Click "Clear Images" to remove uploaded images
2. Clear browser local storage (developer tools)
3. Or clear browser data for this site

## Support and Resources

### Documentation

- [Azure Speech Service Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/)
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-services/)
- [Personal Voice Documentation](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview)

### Getting Help

For issues or questions:
1. Check browser console for error messages
2. Review the implementation specification in `docs/implementation-spec.md`
3. Ensure all Azure resources are properly configured
4. Verify API endpoints and authentication

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-28
