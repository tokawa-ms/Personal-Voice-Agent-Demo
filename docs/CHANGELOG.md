# 変更履歴

## [UI改善] 2025-10-28

### 設定入力 UI の整理

#### 改善内容

設定入力項目をサービスごとにグループ化し、ユーザーにとって分かりやすい UI に改善しました。

1. **セクション化による視覚的な整理**
   - Speech Service セクション
     - Speech Service Region
     - Speech Service Key
     - Personal Voice Speaker Profile ID
     - Language (e.g., en-US, ja-JP)
     - Personal Voice Model
   - AI Foundry セクション
     - AI Foundry Project Endpoint
     - Agent ID
   - Entra ID セクション
     - Entra ID Token

2. **カラーコーディング**
   - Speech Service: 青色の枠線 + マイクアイコン
   - AI Foundry: 緑色の枠線 + 電球アイコン
   - Entra ID: 紫色の枠線 + 鍵アイコン

3. **レスポンシブデザインの維持**
   - デスクトップ: 各セクション内のフィールドがグリッドレイアウトで表示
   - タブレット・モバイル: 各セクションが縦に積み重なり、フィールドが適切に配置

#### 技術的な詳細

##### HTML構造の変更

```html
<!-- 変更前: フラットなグリッドレイアウト -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 全ての入力フィールド -->
</div>

<!-- 変更後: セクション化されたレイアウト -->
<div class="space-y-6">
    <!-- Speech Service Section -->
    <div class="border-2 border-blue-200 rounded-lg p-5 bg-blue-50">
        <h3>Speech Service</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Speech Service フィールド -->
        </div>
    </div>
    
    <!-- AI Foundry Section -->
    <div class="border-2 border-green-200 rounded-lg p-5 bg-green-50">
        <h3>AI Foundry</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- AI Foundry フィールド -->
        </div>
    </div>
    
    <!-- Entra ID Section -->
    <div class="border-2 border-purple-200 rounded-lg p-5 bg-purple-50">
        <h3>Entra ID</h3>
        <div class="grid grid-cols-1 gap-4">
            <!-- Entra ID フィールド -->
        </div>
    </div>
</div>
```

#### ユーザーへの影響

この改善により、以下のメリットがあります：
- ✅ 設定項目の目的が明確になり、どの設定がどのサービスに関連するかが一目で分かる
- ✅ 視覚的な区別により、設定ミスを減らすことができる
- ✅ 各サービスごとに設定を確認・更新しやすくなる
- ✅ 既存の機能との互換性を完全に保持

#### アップグレード手順

1. 最新のコードを取得
2. ブラウザのキャッシュをクリア（または強制再読み込み: Ctrl+Shift+R / Cmd+Shift+R）
3. アプリケーションを再度開く
4. 設定パネルを開いて、新しいレイアウトを確認

---

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
