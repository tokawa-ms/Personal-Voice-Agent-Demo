# 変更履歴

## [機能追加] 2025-11-05

### 括弧書き削除機能の実装

#### 実装内容

AI Agent Service からの応答に含まれる括弧書き（【】や（））を音声合成時に削除する機能を追加しました。

**目的**: 
- AI Agent が参照情報や補足説明を括弧で示す際、その情報は視覚的にはユーザーに伝えるべきですが、音声で読み上げる必要はありません
- UI上では括弧書きを含む完全なメッセージを表示し、音声合成時のみ括弧書きを削除することで、より自然な音声応答を実現します

**削除対象の括弧**:
- 全角角括弧: 【】
- 全角丸括弧: （）
- 半角角括弧: []
- 半角丸括弧: ()

**例**:
```
元のテキスト: 
"参考資料は【4:1†FY26 EPS Asia Tech Team Strategy Memo.pdf】にあります。開発センター（ソフトウェア・デベロップメント・センター）で作業しています。"

UIに表示: 
"参考資料は【4:1†FY26 EPS Asia Tech Team Strategy Memo.pdf】にあります。開発センター（ソフトウェア・デベロップメント・センター）で作業しています。"

音声合成用テキスト:
"参考資料はにあります。開発センターで作業しています。"
```

#### 技術的な詳細

##### 新規追加関数: `removeBracketedText`

```javascript
/**
 * 括弧書きを削除する関数
 * AI Agent Service の応答から括弧書き（【】や（））を削除して音声合成用のテキストを生成
 * @param {string} text - 元のテキスト
 * @returns {string} - 括弧書きを削除したテキスト
 */
function removeBracketedText(text) {
    if (!text) return '';
    
    // 【】の中身を削除（全角角括弧）
    let cleanedText = text.replace(/【[^】]*】/g, '');
    
    // （）の中身を削除（全角丸括弧）
    cleanedText = cleanedText.replace(/（[^）]*）/g, '');
    
    // 半角括弧も削除
    cleanedText = cleanedText.replace(/\[[^\]]*\]/g, '');
    cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
    
    // 連続する空白を1つの空白に置換
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    return cleanedText;
}
```

##### `synthesizeSpeech` 関数の修正

音声合成前に括弧書きを削除するロジックを追加:

```javascript
async function synthesizeSpeech(text) {
    // ... 省略 ...
    
    // 括弧書きを削除してから音声合成用のテキストを生成
    const textWithoutBrackets = removeBracketedText(text);
    
    // テキストをXMLエスケープ
    const escapedText = escapeXml(textWithoutBrackets);
    
    // ... 省略 ...
}
```

##### データフロー

```
AI Agent の応答
    ↓
UIに元のテキスト（括弧書き含む）を表示  ← addMessageToUI('agent', response)
    ↓
音声合成前に括弧書きを削除            ← removeBracketedText(response)
    ↓
削除後のテキストをXMLエスケープ         ← escapeXml(textWithoutBrackets)
    ↓
Personal Voice で音声合成             ← synthesizeSpeech()
```

#### テスト結果

以下のテストケースで動作を確認:

1. ✅ 全角角括弧【4:1†FY26 EPS Asia Tech Team Strategy Memo.pdf】の削除
2. ✅ 全角丸括弧（ソフトウェア・デベロップメント・センター）の削除
3. ✅ 両方の括弧が混在する場合の削除
4. ✅ 括弧なしテキストの保持
5. ✅ 半角括弧の削除
6. ✅ 複数の括弧の削除

#### ユーザーへの影響

この機能により、以下のメリットがあります:

- ✅ AI Agent の応答がより自然な音声で再生されます
- ✅ 参照情報や補足説明は画面上で確認でき、音声では冗長な情報を省略できます
- ✅ 既存の機能との互換性を完全に保持（UI表示は変更なし）
- ✅ 手動でのテキスト入力による会話には影響しません

#### 使用上の注意

- この機能は **音声合成時のみ** 適用されます
- チャットUIには括弧書きを含む元のメッセージがそのまま表示されます
- コンソールログで括弧削除前後のテキストを確認できます

#### アップグレード手順

1. 最新のコードを取得
2. ブラウザのキャッシュをクリア（または強制再読み込み: Ctrl+Shift+R / Cmd+Shift+R）
3. アプリケーションを開き、通常通り使用
4. AI Agent の応答に括弧書きが含まれる場合、音声では括弧内の内容が読み上げられないことを確認

---

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
