# 変更履歴

## [修正] 2025-10-28

### API エラーの修正

#### 修正内容

1. **AI Foundry Agent Service API Version パラメータの追加**
   - 問題: API 呼び出しで API Version がないというエラーが発生していました
   - 修正: すべての Agent Service API 呼び出しに `api-version=2025-05-01` クエリパラメータを追加
   - 影響範囲:
     - スレッド作成 API
     - メッセージ追加 API
     - エージェント実行 API
     - 実行ステータス確認 API
     - メッセージ取得 API

2. **Speech SDK AudioConfig メソッド名の修正**
   - 問題: `speechSDK.AudioConfig.fromDefaultMicrophone is not a function` エラーが発生していました
   - 原因: メソッド名が誤っていました（`fromDefaultMicrophone` → `fromDefaultMicrophoneInput`）
   - 修正: 正しいメソッド名 `fromDefaultMicrophoneInput()` に変更
   - 参考: [Azure Speech SDK JavaScript ドキュメント](https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig)

3. **エラーログの強化**
   - API エラー発生時に詳細な情報をログに出力するよう改善
   - 出力情報:
     - HTTP ステータスコード
     - HTTP ステータステキスト
     - レスポンスボディ（エラー詳細）
   - これにより、今後のトラブルシューティングが容易になります

#### 技術的な詳細

##### Agent Service API の正しい呼び出し方法

```javascript
// スレッド作成
const response = await fetch(`${agentEndpoint}/threads?api-version=2025-05-01`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${entraToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
});
```

##### Speech SDK AudioConfig の正しい使用方法

```javascript
// AudioConfig の初期化
const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
```

#### 参考リンク

- [Azure AI Foundry Agent Service API リファレンス](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/quickstart)
- [Azure Speech SDK JavaScript ドキュメント](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-recognize-speech)
- [AudioConfig クラスリファレンス](https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig)

#### 影響を受けるユーザー

これらの修正は以下の機能に影響します：
- ✅ Azure AI Foundry Agent Service との接続テスト
- ✅ エージェントとの対話機能
- ✅ マイクを使用した音声認識機能

#### アップグレード手順

1. 最新のコードを取得
2. ブラウザのキャッシュをクリア
3. アプリケーションを再度開く
4. 設定パネルで「Test Connection」を実行して接続を確認

---

**バージョン**: 1.0.1  
**作成日**: 2025-10-28  
**作成者**: GitHub Copilot Agent
