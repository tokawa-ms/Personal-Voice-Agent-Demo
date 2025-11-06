# 🎙️ Personal Voice Agent Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Azure](https://img.shields.io/badge/Azure-0089D6?style=flat&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)

> An interactive AI agent demo combining **Azure Personal Voice** and **Azure AI Agent Service** for personalized voice conversations

## 📋 Overview

This application demonstrates the integration of Azure's Personal Voice technology with AI Agent Service, creating an interactive conversational agent with personalized voice responses. Users can communicate via text or voice, and receive responses in a customized voice powered by Azure Personal Voice.

### ✨ Key Features

- 🎤 **Voice Interaction** - Speech-to-Text for natural voice input
- 🔊 **Personal Voice** - Text-to-Speech with custom voice profiles
- 🤖 **AI Agent Integration** - Powered by Azure AI Foundry Agent Service
- 🖼️ **Customizable Avatar** - Upload custom images for agent visualization
- 💾 **Persistent Settings** - Browser storage for configuration and images
- 📱 **Responsive Design** - Works seamlessly across devices
- ⚡ **Zero Installation** - Run directly in your browser

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | Latest | Semantic markup |
| CSS3 | Latest | Styling |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x (CDN) | Utility-first CSS framework |
| JavaScript | ES6+ | Interactive functionality |

### Azure Services
| Service | Purpose |
|---------|---------|
| [Azure Speech Service](https://azure.microsoft.com/services/cognitive-services/speech-services/) | Speech-to-Text and Text-to-Speech |
| [Azure Personal Voice](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview) | Custom voice synthesis |
| [Azure AI Foundry Agent Service](https://learn.microsoft.com/azure/ai-services/) | AI agent backend |

### External Dependencies
- **Azure Speech SDK** - Loaded via CDN for speech recognition and synthesis

## 📁 Project Structure

```
📦 Personal-Voice-Agent-Demo/
├── 📄 README.md                    # Project overview
├── 📄 LICENSE                      # MIT License
├── 📁 .github/
│   └── 📄 copilot-instructions.md # Copilot configuration
├── 📁 docs/                        # Documentation
│   ├── 📄 implementation-spec.md  # Technical specifications
│   └── 📄 user-guide.md           # User guide
└── 📁 src/                         # Application source
    ├── 📄 index.html               # Main HTML file
    ├── 📁 css/
    │   └── 📄 styles.css           # Custom styles
    ├── 📁 js/
    │   └── 📄 script.js            # Main application logic
    └── 📁 assets/
        └── 📁 images/              # Image resources
```

## 🚀 Quick Start

### Prerequisites

Before using this application, ensure you have:

- 📌 A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- 📌 Azure Speech Service resource with API key
- 📌 Azure Personal Voice profile with Speaker Profile ID
- 📌 Azure AI Foundry project with configured Agent
- 📌 Entra ID authentication token

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/tokawa-ms/Personal-Voice-Agent-Demo.git
cd Personal-Voice-Agent-Demo
```

#### 2. Open the Application

Simply open `src/index.html` in your web browser:

```bash
# On macOS
open src/index.html

# On Linux
xdg-open src/index.html

# On Windows
start src/index.html
```

Or drag and drop the file into your browser window.

#### 3. Configure Azure Services

When the application opens, you'll see a configuration panel. Enter your Azure service credentials:

1. **Speech Service Region** (e.g., `eastus`, `japaneast`)
2. **Speech Service Key**
3. **Personal Voice Speaker Profile ID**
4. **Language** (e.g., `en-US`, `ja-JP`)
5. **AI Foundry Project Endpoint**
6. **Entra ID Token** 
8. **Agent ID**

##### How to take Entra ID Token

For tenants where SSO using Entra ID is prohibited, we are using a method to manually obtain tokens via Azure CLI. Please enter the following commands in order and use the displayed bearer token.

```powershell
az login --tenant <yourtenant>.onmicrosoft.com
```

```powershell
az account get-access-token --scope https://ai.azure.com/.default | ConvertFrom-Json | Select-Object -ExpandProperty accessToken
```

#### 4. Test Connection

Click **Test Connection** to verify your settings, then **Save & Close**.

#### 5. Start Chatting

You're ready to interact with your personal voice agent!

## 💡 Usage Examples

### Text Interaction

1. Type your message in the input box
2. Click **Send** or press **Enter**
3. The agent will respond and speak using Personal Voice

### Voice Interaction

1. Click the **microphone icon** to start voice recognition
2. Speak your message
3. The system will automatically recognize and send your message
4. The agent will respond with synthesized speech

### Customizing the Avatar

1. Upload a background image for the agent display
2. Upload an avatar image for visual customization
3. Images are saved in browser storage for future sessions

### Managing Sessions

Click **Clear Session** to reset the conversation and start fresh with a new thread.

## 📱 Responsive Design

This application is fully responsive and optimized for:

- 📱 **Mobile**: 320px〜768px
- 📊 **Tablet**: 768px〜1024px
- 💻 **Desktop**: 1024px and above

## 🔒 Security and Privacy

### API Key Management

- ✅ Configure via UI input fields
- ✅ Stored in browser local storage (for demo purposes)
- ❌ Never hardcoded in source
- 🔐 Use short-lived tokens for production

### Data Storage

- Configuration and images stored locally in browser
- No conversation history is persisted
- All data stays on your device

### Production Recommendations

For production use:
- Implement secure backend for credential management
- Use OAuth/OpenID Connect for authentication
- Implement proper CORS policies
- Use environment-specific configurations

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:

- **[User Guide](docs/user-guide.md)** - Step-by-step instructions for using the application
- **[Implementation Specification](docs/implementation-spec.md)** - Technical details and architecture

## 🎯 Features in Detail

### Configuration Panel

- **Auto-save**: Settings are automatically saved to browser storage
- **Auto-connect**: Saved settings are loaded and tested on startup
- **Validation**: Connection testing before use

### Avatar Display

- **Default Icon**: Shows when no images are uploaded
- **Background Layer**: Customizable background image
- **Avatar Layer**: Overlay avatar image
- **Persistence**: Images saved across sessions

### Chat Interface

- **Rich Messages**: Visual distinction between user and agent messages
- **Status Indicators**: Real-time feedback on system state
- **Auto-scroll**: Automatically scrolls to latest message
- **Keyboard Support**: Enter to send, Esc to stop recording

### Voice Features

- **Continuous Recognition**: Natural speaking without button presses
- **Auto-send**: Recognized text automatically sent to agent
- **Personal Voice**: Custom voice synthesis from your voice profile
- **Multi-language**: Supports multiple languages (en-US, ja-JP, etc.)

## 🔧 Troubleshooting

### Common Issues

**Problem**: Microphone doesn't work  
**Solution**: Check browser permissions and ensure HTTPS (for production)

**Problem**: No sound output  
**Solution**: Verify Speaker Profile ID and language settings match

**Problem**: Agent doesn't respond  
**Solution**: Check Entra ID token validity and Agent Service connectivity

**Problem**: Configuration panel won't close  
**Solution**: Ensure connection test passes or manually save settings

See the [User Guide](docs/user-guide.md) for more troubleshooting tips.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🆘 Support and Resources

### Azure Documentation

- 📖 [Azure Speech Service Documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/)
- 📖 [Personal Voice Overview](https://learn.microsoft.com/azure/ai-services/speech-service/personal-voice-overview)
- 📖 [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-services/)

### Application Documentation

- 📖 [User Guide](docs/user-guide.md) - Complete user documentation
- 📖 [Implementation Spec](docs/implementation-spec.md) - Technical specifications

### Getting Help

- 🐛 **Bug Reports**: [Issues](https://github.com/tokawa-ms/Personal-Voice-Agent-Demo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/tokawa-ms/Personal-Voice-Agent-Demo/discussions)

## 🌟 Acknowledgments

This application was developed using:
- **GitHub Copilot** - AI-powered code completion
- **Azure AI Services** - Cloud AI capabilities
- **Tailwind CSS** - Utility-first CSS framework

---

<div align="center">
  <strong>🎙️ Experience the Future of Voice AI! 🤖</strong><br>
  Built with ❤️ using Azure AI and GitHub Copilot
</div>
