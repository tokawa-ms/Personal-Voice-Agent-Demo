// Personal Voice Agent Demo - Main Script
// このスクリプトは、Azure Personal VoiceとAzure AI Agent Serviceを統合したエージェントデモを実装します。

console.log('Personal Voice Agent Demo - Initializing...');

// =============================================================================
// グローバル変数とステート管理
// =============================================================================

const state = {
    config: {
        speechRegion: '',
        speechKey: '',
        speakerProfileId: '',
        language: 'en-US',
        agentEndpoint: '',
        entraToken: '',
        agentId: ''
    },
    images: {
        background: null,
        avatar: null
    },
    session: {
        threadId: null,
        isRecording: false,
        isSpeaking: false,
        recognizer: null,
        synthesizer: null
    },
    messages: []
};

// =============================================================================
// LocalStorage 管理
// =============================================================================

const STORAGE_KEYS = {
    CONFIG: 'pva_config',
    IMAGES: 'pva_images'
};

/**
 * 設定をローカルストレージに保存
 */
function saveConfigToStorage() {
    console.log('Saving configuration to localStorage...');
    try {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.config));
        console.log('Configuration saved successfully');
    } catch (error) {
        console.error('Failed to save configuration:', error);
    }
}

/**
 * 設定をローカルストレージから読み込み
 */
function loadConfigFromStorage() {
    console.log('Loading configuration from localStorage...');
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (saved) {
            const config = JSON.parse(saved);
            state.config = { ...state.config, ...config };
            
            // UIに反映
            document.getElementById('speechRegion').value = state.config.speechRegion || '';
            document.getElementById('speechKey').value = state.config.speechKey || '';
            document.getElementById('speakerProfileId').value = state.config.speakerProfileId || '';
            document.getElementById('language').value = state.config.language || 'en-US';
            document.getElementById('agentEndpoint').value = state.config.agentEndpoint || '';
            document.getElementById('entraToken').value = state.config.entraToken || '';
            document.getElementById('agentId').value = state.config.agentId || '';
            
            console.log('Configuration loaded successfully');
            return true;
        }
    } catch (error) {
        console.error('Failed to load configuration:', error);
    }
    return false;
}

/**
 * 画像をローカルストレージに保存
 */
function saveImagesToStorage() {
    console.log('Saving images to localStorage...');
    try {
        localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(state.images));
        console.log('Images saved successfully');
    } catch (error) {
        console.error('Failed to save images:', error);
    }
}

/**
 * 画像をローカルストレージから読み込み
 */
function loadImagesFromStorage() {
    console.log('Loading images from localStorage...');
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.IMAGES);
        if (saved) {
            const images = JSON.parse(saved);
            state.images = images;
            
            // 画像を表示
            if (images.background) {
                displayBackgroundImage(images.background);
            }
            if (images.avatar) {
                displayAvatarImage(images.avatar);
            }
            
            console.log('Images loaded successfully');
        }
    } catch (error) {
        console.error('Failed to load images:', error);
    }
}

// =============================================================================
// UI 初期化
// =============================================================================

/**
 * ページ読み込み時の初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing UI...');
    
    // ストレージから設定と画像を読み込み
    const hasConfig = loadConfigFromStorage();
    loadImagesFromStorage();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // 設定があれば自動接続を試みる
    if (hasConfig && state.config.speechKey && state.config.agentEndpoint) {
        console.log('Auto-connecting with saved configuration...');
        testConnection(true);
    }
    
    console.log('Initialization complete');
});

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 設定パネル
    document.getElementById('testConnectionBtn').addEventListener('click', () => testConnection(false));
    document.getElementById('saveConfigBtn').addEventListener('click', saveConfiguration);
    
    // 画像アップロード
    document.getElementById('backgroundUpload').addEventListener('change', handleBackgroundUpload);
    document.getElementById('avatarUpload').addEventListener('change', handleAvatarUpload);
    document.getElementById('clearImagesBtn').addEventListener('click', clearImages);
    
    // チャット
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('micBtn').addEventListener('click', toggleMicrophone);
    document.getElementById('clearSessionBtn').addEventListener('click', clearSession);
    
    console.log('Event listeners configured');
}

// =============================================================================
// 設定管理
// =============================================================================

/**
 * 現在の設定値を取得してstateに保存
 */
function captureConfiguration() {
    console.log('Capturing configuration from UI...');
    state.config.speechRegion = document.getElementById('speechRegion').value.trim();
    state.config.speechKey = document.getElementById('speechKey').value.trim();
    state.config.speakerProfileId = document.getElementById('speakerProfileId').value.trim();
    state.config.language = document.getElementById('language').value.trim() || 'en-US';
    state.config.agentEndpoint = document.getElementById('agentEndpoint').value.trim();
    state.config.entraToken = document.getElementById('entraToken').value.trim();
    state.config.agentId = document.getElementById('agentId').value.trim();
    console.log('Configuration captured:', { ...state.config, speechKey: '***', entraToken: '***' });
}

/**
 * 接続テスト
 */
async function testConnection(autoClose = false) {
    console.log('Testing connection...', { autoClose });
    const statusEl = document.getElementById('configStatus');
    
    captureConfiguration();
    
    // 必須項目のバリデーション
    const required = ['speechRegion', 'speechKey', 'agentEndpoint', 'entraToken', 'agentId'];
    const missing = required.filter(key => !state.config[key]);
    
    if (missing.length > 0) {
        const message = `Missing required fields: ${missing.join(', ')}`;
        console.warn(message);
        statusEl.innerHTML = `<span class="text-red-600">❌ ${message}</span>`;
        return;
    }
    
    statusEl.innerHTML = '<span class="text-blue-600">⏳ Testing connection...</span>';
    
    try {
        // Speech Serviceの初期化テスト
        console.log('Initializing Speech Service...');
        await initializeSpeechService();
        
        // Agent Serviceの接続テスト（スレッド作成）
        console.log('Testing Agent Service connection...');
        await createNewThread();
        
        statusEl.innerHTML = '<span class="text-green-600">✅ Connection successful!</span>';
        console.log('Connection test passed');
        
        if (autoClose) {
            setTimeout(() => {
                closeConfigPanel();
            }, 1500);
        }
    } catch (error) {
        console.error('Connection test failed:', error);
        statusEl.innerHTML = `<span class="text-red-600">❌ Connection failed: ${error.message}</span>`;
    }
}

/**
 * 設定を保存して設定パネルを閉じる
 */
function saveConfiguration() {
    console.log('Saving configuration...');
    captureConfiguration();
    saveConfigToStorage();
    closeConfigPanel();
}

/**
 * 設定パネルを閉じる
 */
function closeConfigPanel() {
    console.log('Closing configuration panel');
    const panel = document.getElementById('configPanel');
    panel.classList.add('hidden');
}

// =============================================================================
// Azure Speech Service 統合
// =============================================================================

let speechSDK = null;

/**
 * Speech SDK の動的ロード
 */
async function loadSpeechSDK() {
    if (speechSDK) {
        console.log('Speech SDK already loaded');
        return speechSDK;
    }
    
    console.log('Loading Speech SDK from CDN...');
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://aka.ms/csspeech/jsbrowserpackageraw';
        script.onload = () => {
            console.log('Speech SDK loaded successfully');
            speechSDK = window.SpeechSDK;
            resolve(speechSDK);
        };
        script.onerror = () => {
            console.error('Failed to load Speech SDK');
            reject(new Error('Failed to load Speech SDK'));
        };
        document.head.appendChild(script);
    });
}

/**
 * Speech Service の初期化
 */
async function initializeSpeechService() {
    console.log('Initializing Speech Service...');
    
    await loadSpeechSDK();
    
    const { speechRegion, speechKey, language } = state.config;
    
    // Speech Recognizer の設定
    const speechConfig = speechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = language;
    
    const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophone();
    state.session.recognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
    
    console.log('Speech Recognizer configured:', { language });
    
    // 認識イベントのハンドラー設定
    state.session.recognizer.recognized = (s, e) => {
        if (e.result.reason === speechSDK.ResultReason.RecognizedSpeech) {
            console.log('Speech recognized:', e.result.text);
            handleRecognizedText(e.result.text);
        }
    };
    
    state.session.recognizer.canceled = (s, e) => {
        console.warn('Speech recognition canceled:', e.reason);
        if (state.session.isRecording) {
            updateStatus('Recognition error occurred');
            toggleMicrophone(); // 録音を停止
        }
    };
    
    // Speech Synthesizer の設定（Personal Voice用）
    const synthConfig = speechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    synthConfig.speechSynthesisLanguage = language;
    
    state.session.synthesizer = new speechSDK.SpeechSynthesizer(synthConfig);
    
    console.log('Speech Service initialized successfully');
}

/**
 * 音声認識の開始/停止
 */
function toggleMicrophone() {
    console.log('Toggling microphone...', { currentState: state.session.isRecording });
    
    const micBtn = document.getElementById('micBtn');
    
    if (!state.session.recognizer) {
        console.error('Speech recognizer not initialized');
        updateStatus('Please configure Speech Service first');
        return;
    }
    
    if (state.session.isRecording) {
        // 停止
        console.log('Stopping continuous recognition...');
        state.session.recognizer.stopContinuousRecognitionAsync(
            () => {
                console.log('Recognition stopped');
                state.session.isRecording = false;
                micBtn.classList.remove('active');
                updateStatus('');
            },
            (error) => {
                console.error('Failed to stop recognition:', error);
            }
        );
    } else {
        // 開始
        console.log('Starting continuous recognition...');
        state.session.recognizer.startContinuousRecognitionAsync(
            () => {
                console.log('Recognition started');
                state.session.isRecording = true;
                micBtn.classList.add('active');
                updateStatus('🎤 Listening...', 'recording');
            },
            (error) => {
                console.error('Failed to start recognition:', error);
                updateStatus('Failed to start microphone');
            }
        );
    }
}

/**
 * 認識されたテキストの処理
 */
function handleRecognizedText(text) {
    console.log('Handling recognized text:', text);
    if (text && text.trim()) {
        document.getElementById('messageInput').value = text;
        // 自動送信
        sendMessage();
    }
}

/**
 * Personal Voice での音声合成
 */
async function synthesizeSpeech(text) {
    console.log('Synthesizing speech with Personal Voice...', { textLength: text.length });
    
    if (!state.session.synthesizer) {
        console.error('Speech synthesizer not initialized');
        return;
    }
    
    const { speakerProfileId, language } = state.config;
    
    // Personal Voice用のSSML生成
    const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}">
            <voice name="${language === 'ja-JP' ? 'ja-JP-NanamiNeural' : 'en-US-JennyNeural'}">
                <mstts:ttsembedding speakerProfileId="${speakerProfileId}">
                    ${text}
                </mstts:ttsembedding>
            </voice>
        </speak>
    `;
    
    console.log('SSML prepared for synthesis');
    
    return new Promise((resolve, reject) => {
        state.session.isSpeaking = true;
        updateStatus('🔊 Speaking...', 'speaking');
        
        state.session.synthesizer.speakSsmlAsync(
            ssml,
            (result) => {
                console.log('Speech synthesis completed:', result.reason);
                state.session.isSpeaking = false;
                updateStatus('');
                
                if (result.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
                    resolve();
                } else {
                    console.error('Synthesis failed:', result.errorDetails);
                    reject(new Error(result.errorDetails));
                }
            },
            (error) => {
                console.error('Speech synthesis error:', error);
                state.session.isSpeaking = false;
                updateStatus('');
                reject(error);
            }
        );
    });
}

// =============================================================================
// Azure AI Agent Service 統合
// =============================================================================

/**
 * 新しいスレッドを作成
 */
async function createNewThread() {
    console.log('Creating new thread...');
    
    const { agentEndpoint, entraToken } = state.config;
    
    try {
        const response = await fetch(`${agentEndpoint}/threads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${entraToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create thread: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        state.session.threadId = data.id;
        console.log('Thread created successfully:', state.session.threadId);
        
        return state.session.threadId;
    } catch (error) {
        console.error('Error creating thread:', error);
        throw error;
    }
}

/**
 * エージェントにメッセージを送信
 */
async function sendToAgent(message) {
    console.log('Sending message to agent...', { message, threadId: state.session.threadId });
    
    if (!state.session.threadId) {
        console.log('No thread exists, creating new thread...');
        await createNewThread();
    }
    
    const { agentEndpoint, entraToken, agentId } = state.config;
    
    try {
        // メッセージをスレッドに追加
        console.log('Adding message to thread...');
        const messageResponse = await fetch(
            `${agentEndpoint}/threads/${state.session.threadId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${entraToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: 'user',
                    content: message
                })
            }
        );
        
        if (!messageResponse.ok) {
            throw new Error(`Failed to add message: ${messageResponse.status}`);
        }
        
        console.log('Message added to thread');
        
        // エージェントを実行
        console.log('Running agent...');
        const runResponse = await fetch(
            `${agentEndpoint}/threads/${state.session.threadId}/runs`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${entraToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assistant_id: agentId
                })
            }
        );
        
        if (!runResponse.ok) {
            throw new Error(`Failed to run agent: ${runResponse.status}`);
        }
        
        const runData = await runResponse.json();
        console.log('Agent run initiated:', runData.id);
        
        // 実行完了を待機
        const result = await waitForRunCompletion(runData.id);
        console.log('Agent run completed');
        
        // レスポンスを取得
        const agentResponse = await getAgentResponse();
        console.log('Agent response received:', agentResponse);
        
        return agentResponse;
    } catch (error) {
        console.error('Error communicating with agent:', error);
        throw error;
    }
}

/**
 * エージェント実行の完了を待機
 */
async function waitForRunCompletion(runId, maxAttempts = 30) {
    console.log('Waiting for run completion...', { runId });
    
    const { agentEndpoint, entraToken } = state.config;
    
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
            `${agentEndpoint}/threads/${state.session.threadId}/runs/${runId}`,
            {
                headers: {
                    'Authorization': `Bearer ${entraToken}`
                }
            }
        );
        
        const data = await response.json();
        console.log(`Run status check ${i + 1}/${maxAttempts}:`, data.status);
        
        if (data.status === 'completed') {
            return data;
        } else if (data.status === 'failed' || data.status === 'cancelled') {
            throw new Error(`Run ${data.status}: ${data.last_error?.message || 'Unknown error'}`);
        }
    }
    
    throw new Error('Run timeout');
}

/**
 * エージェントのレスポンスを取得
 */
async function getAgentResponse() {
    console.log('Getting agent response...');
    
    const { agentEndpoint, entraToken } = state.config;
    
    const response = await fetch(
        `${agentEndpoint}/threads/${state.session.threadId}/messages`,
        {
            headers: {
                'Authorization': `Bearer ${entraToken}`
            }
        }
    );
    
    if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Retrieved messages:', data.data?.length || 0);
    
    // 最新のアシスタントメッセージを取得
    const assistantMessages = data.data.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[0];
        const content = latestMessage.content[0]?.text?.value || '';
        console.log('Latest assistant message:', content);
        return content;
    }
    
    return '';
}

// =============================================================================
// メッセージ送信とチャット管理
// =============================================================================

/**
 * メッセージを送信
 */
async function sendMessage() {
    console.log('Send message triggered');
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        console.log('Empty message, ignoring');
        return;
    }
    
    console.log('Sending message:', message);
    
    // UIにユーザーメッセージを表示
    addMessageToUI('user', message);
    input.value = '';
    
    // ステータス更新
    updateStatus('⏳ Processing...', 'processing');
    
    try {
        // エージェントにメッセージを送信
        const response = await sendToAgent(message);
        
        // UIにエージェントレスポンスを表示
        addMessageToUI('agent', response);
        
        // Personal Voiceで音声合成
        if (state.config.speakerProfileId) {
            console.log('Synthesizing agent response...');
            await synthesizeSpeech(response);
        } else {
            console.log('Speaker Profile ID not set, skipping synthesis');
        }
        
        updateStatus('');
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToUI('agent', `Error: ${error.message}`);
        updateStatus('');
    }
}

/**
 * UIにメッセージを追加
 */
function addMessageToUI(role, content) {
    console.log('Adding message to UI:', { role, contentLength: content.length });
    
    const chatMessages = document.getElementById('chatMessages');
    
    // 初回メッセージの場合、プレースホルダーを削除
    if (state.messages.length === 0) {
        chatMessages.innerHTML = '';
    }
    
    // メッセージをステートに保存
    state.messages.push({ role, content, timestamp: new Date() });
    
    // メッセージ要素を作成
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = role === 'user' ? 'U' : 'A';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    if (role === 'user') {
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(avatarDiv);
    } else {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // スクロールを最下部に
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    console.log('Message added to UI');
}

/**
 * セッションをクリア
 */
async function clearSession() {
    console.log('Clearing session...');
    
    if (confirm('Are you sure you want to clear the conversation? This will start a new session.')) {
        // 新しいスレッドを作成
        try {
            await createNewThread();
            
            // UIをクリア
            state.messages = [];
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="text-gray-400 text-center py-8">Start a conversation with your agent...</div>';
            
            console.log('Session cleared successfully');
            updateStatus('Session cleared');
            setTimeout(() => updateStatus(''), 2000);
        } catch (error) {
            console.error('Error clearing session:', error);
            alert('Failed to clear session: ' + error.message);
        }
    }
}

/**
 * ステータス表示を更新
 */
function updateStatus(message, type = '') {
    console.log('Updating status:', { message, type });
    const statusEl = document.getElementById('statusIndicator');
    statusEl.textContent = message;
    statusEl.className = `mt-2 text-sm ${type ? type : 'text-gray-500'}`;
}

// =============================================================================
// 画像管理
// =============================================================================

/**
 * 背景画像のアップロード処理
 */
function handleBackgroundUpload(event) {
    console.log('Background image upload triggered');
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    console.log('Processing background image:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        state.images.background = dataUrl;
        displayBackgroundImage(dataUrl);
        saveImagesToStorage();
        console.log('Background image uploaded and saved');
    };
    reader.readAsDataURL(file);
}

/**
 * アバター画像のアップロード処理
 */
function handleAvatarUpload(event) {
    console.log('Avatar image upload triggered');
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    console.log('Processing avatar image:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        state.images.avatar = dataUrl;
        displayAvatarImage(dataUrl);
        saveImagesToStorage();
        console.log('Avatar image uploaded and saved');
    };
    reader.readAsDataURL(file);
}

/**
 * 背景画像を表示
 */
function displayBackgroundImage(dataUrl) {
    console.log('Displaying background image');
    const img = document.getElementById('backgroundImage');
    const defaultAvatar = document.getElementById('defaultAvatar');
    const display = document.getElementById('avatarDisplay');
    
    img.src = dataUrl;
    img.classList.remove('hidden');
    defaultAvatar.classList.add('hidden');
    display.classList.add('has-background');
}

/**
 * アバター画像を表示
 */
function displayAvatarImage(dataUrl) {
    console.log('Displaying avatar image');
    const img = document.getElementById('avatarImage');
    const defaultAvatar = document.getElementById('defaultAvatar');
    
    img.src = dataUrl;
    img.classList.remove('hidden');
    defaultAvatar.classList.add('hidden');
}

/**
 * 画像をクリア
 */
function clearImages() {
    console.log('Clearing images...');
    
    if (confirm('Are you sure you want to clear all uploaded images?')) {
        state.images.background = null;
        state.images.avatar = null;
        
        document.getElementById('backgroundImage').classList.add('hidden');
        document.getElementById('avatarImage').classList.add('hidden');
        document.getElementById('defaultAvatar').classList.remove('hidden');
        document.getElementById('avatarDisplay').classList.remove('has-background');
        
        document.getElementById('backgroundUpload').value = '';
        document.getElementById('avatarUpload').value = '';
        
        saveImagesToStorage();
        console.log('Images cleared');
    }
}

// =============================================================================
// エラーハンドリング
// =============================================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('Script loaded successfully');
