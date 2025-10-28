# Personal Voice Agent Demo - 実装仕様書

## 概要

このアプリケーションは、Azure Personal Voice と Azure AI Agent Service を組み合わせたインタラクティブなエージェントデモです。ユーザーは音声またはテキストでエージェントと対話でき、エージェントの応答は個人化された音声で再生されます。

## 技術スタック

### フロントエンド
- **HTML5**: セマンティックなマークアップ
- **CSS3 + Tailwind CSS**: モダンなレスポンシブデザイン
- **JavaScript (ES6+)**: インタラクティブ機能の実装

### Azure サービス
- **Azure Speech Service**: 
  - Speech-to-Text (音声認識)
  - Text-to-Speech with Personal Voice (音声合成)
- **Azure AI Foundry Agent Service**: AI エージェントのバックエンド

## アーキテクチャ

### ディレクトリ構成

```
src/
├── index.html          # メインHTML
├── css/
│   └── styles.css      # カスタムスタイル
├── js/
│   └── script.js       # メインアプリケーションロジック
└── assets/
    └── images/         # 画像リソース（将来の拡張用）
```

## 機能仕様

### 1. 設定パネル（画面上部）

#### 目的
Azure サービスへの接続情報を設定・管理する

#### 入力項目
- **Speech Service Region**: Azure Speech Service のリージョン（例: eastus, japaneast）
- **Speech Service Key**: API アクセスキー
- **Personal Voice Speaker Profile ID**: 事前作成された Personal Voice のスピーカープロファイル ID
- **Language**: 音声認識・合成の言語（例: en-US, ja-JP, en-GB）
- **Personal Voice Model**: Personal Voice で使用する音声モデル（DragonLatestNeural または PhoenixLatestNeural）
- **AI Foundry Project Endpoint**: Agent Service のエンドポイント URL
- **Entra ID Token**: API 認証用のベアラートークン
- **Agent ID**: 事前作成されたエージェントの ID

#### 機能
- **Test Connection**: 設定値の検証と接続テスト
- **Save & Close**: 設定をローカルストレージに保存してパネルを閉じる
- **自動再接続**: 保存された設定で自動的に接続を試行

#### ローカルストレージ
- キー: `pva_config`
- 保存内容: すべての設定値（JSON形式）

### 2. アバター表示エリア（画面左側）

#### 目的
エージェントの視覚的表現をカスタマイズ

#### 機能
- **デフォルトアイコン**: 画像未設定時に人型アイコンを表示
- **背景画像アップロード**: ローカルファイルから背景画像を選択
- **アバター画像アップロード**: ローカルファイルからアバター画像を選択
- **画像クリア**: アップロードされた画像をすべて削除
- **永続化**: アップロードされた画像をローカルストレージに保存

#### ローカルストレージ
- キー: `pva_images`
- 保存内容: Base64エンコードされた画像データ（JSON形式）

#### 表示レイヤー構造
1. デフォルトアイコン（最背面、画像未設定時のみ表示）
2. 背景画像（中間レイヤー）
3. アバター画像（最前面）

### 3. 対話UIエリア（画面右側）

#### 目的
エージェントとのリアルタイム対話

#### コンポーネント

##### チャットメッセージエリア
- スクロール可能な対話履歴表示
- ユーザーメッセージ: 右寄せ、青色
- エージェントメッセージ: 左寄せ、グレー色
- アバター表示: U（ユーザー）、A（エージェント）

##### 入力エリア
- **テキスト入力ボックス**: 手動でメッセージを入力
- **マイクボタン**: 音声認識のオン/オフ切り替え
  - アクティブ時: 赤色で点滅アニメーション
  - 継続的な音声認識（continuous recognition）
- **送信ボタン**: メッセージを送信
- **Enter キー**: 送信のショートカット

##### セッション管理
- **Clear Session ボタン**: 
  - 対話履歴をクリア
  - 新しいスレッドを作成
  - UI をリセット

#### ステータス表示
- 🎤 Listening...: 音声認識中
- ⏳ Processing...: エージェント処理中
- 🔊 Speaking...: 音声合成・再生中

## データフロー

### メッセージ送信フロー

```
ユーザー入力（テキスト/音声）
    ↓
UIにユーザーメッセージを表示
    ↓
Agent Service APIに送信
    ↓
スレッドにメッセージを追加
    ↓
エージェントを実行
    ↓
実行完了を待機（ポーリング）
    ↓
エージェントのレスポンスを取得
    ↓
UIにエージェントメッセージを表示
    ↓
Personal Voiceで音声合成
    ↓
音声再生
```

### 音声認識フロー

```
マイクボタンクリック
    ↓
連続音声認識を開始
    ↓
音声を認識（リアルタイム）
    ↓
認識結果をテキスト入力ボックスに自動入力
    ↓
自動的にメッセージ送信
```

## Azure サービス統合詳細

### Speech Service - Speech-to-Text

#### SDK
- Azure Speech SDK (JavaScript Browser Package)
- CDN: `https://aka.ms/csspeech/jsbrowserpackageraw`

#### 設定
```javascript
const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
speechConfig.speechRecognitionLanguage = language;
const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophone();
const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
```

#### 使用モード
- **Continuous Recognition**: 継続的な音声認識
- イベントハンドラー:
  - `recognized`: 音声認識成功時
  - `canceled`: エラーまたはキャンセル時

### Speech Service - Personal Voice

#### SSML フォーマット
```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${language}">
    <voice name="${voiceName}">
        <mstts:ttsembedding speakerProfileId="${speakerProfileId}">
            ${text}
        </mstts:ttsembedding>
    </voice>
</speak>
```

#### 音声名の選択肢
Personal Voice で利用可能な音声モデル：
- `DragonLatestNeural`（既定値）
- `PhoenixLatestNeural`

これらは設定画面のドロップダウンで選択可能です。

### AI Foundry Agent Service

#### API エンドポイント

1. **スレッド作成**
   - メソッド: POST
   - URL: `{endpoint}/threads`
   - レスポンス: `{ id: "thread_id" }`

2. **メッセージ追加**
   - メソッド: POST
   - URL: `{endpoint}/threads/{threadId}/messages`
   - ボディ: `{ role: "user", content: "message" }`

3. **エージェント実行**
   - メソッド: POST
   - URL: `{endpoint}/threads/{threadId}/runs`
   - ボディ: `{ assistant_id: "agent_id" }`

4. **実行ステータス確認**
   - メソッド: GET
   - URL: `{endpoint}/threads/{threadId}/runs/{runId}`
   - ステータス: queued, in_progress, completed, failed, cancelled

5. **メッセージ取得**
   - メソッド: GET
   - URL: `{endpoint}/threads/{threadId}/messages`
   - レスポンス: メッセージ配列（最新順）

#### 認証
- ヘッダー: `Authorization: Bearer {entraToken}`

## 状態管理

### グローバルステート

```javascript
const state = {
    config: {
        speechRegion: '',
        speechKey: '',
        speakerProfileId: '',
        language: 'en-US',
        voiceName: 'DragonLatestNeural',
        agentEndpoint: '',
        entraToken: '',
        agentId: ''
    },
    images: {
        background: null,  // Base64 data URL
        avatar: null       // Base64 data URL
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
```

## UI/UX 詳細

### レスポンシブデザイン

#### ブレークポイント
- モバイル: < 768px
- タブレット: 768px - 1024px
- デスクトップ: > 1024px

#### モバイル対応
- 設定パネル: 1カラムレイアウト
- メインコンテンツ: 縦スタック
- メッセージ幅: 最大90%

### アニメーション

1. **設定パネル**: スライドダウン (0.3s)
2. **メッセージ**: フェードイン (0.3s)
3. **マイクボタン**: パルスアニメーション (1.5s 無限)
4. **ローディング**: スピナー回転 (1s 無限)

### カラーパレット

- **プライマリ**: Blue (#3b82f6)
- **成功**: Green (#10b981)
- **警告**: Yellow (#f59e0b)
- **エラー**: Red (#dc2626)
- **ニュートラル**: Gray (#6b7280)

## セキュリティ考慮事項

### データ保護
- API キーとトークンは UI 入力のみ（ハードコード禁止）
- ローカルストレージに保存（開発/デモ用途）
- 本番環境では安全な認証メカニズムを推奨

### CORS
- Agent Service API が CORS を許可する必要がある
- ブラウザベースのアプリケーションのため

## エラーハンドリング

### ログ出力
- すべての主要な操作でコンソールログを出力
- エラーは `console.error` で記録
- デバッグ情報は `console.log` で記録

### ユーザーフィードバック
- 設定エラー: 設定パネルにステータス表示
- 通信エラー: チャットにエラーメッセージを表示
- 音声認識エラー: ステータスインジケーターで通知

### グローバルエラーハンドラー
- `window.error`: JavaScript エラーをキャッチ
- `window.unhandledrejection`: Promise エラーをキャッチ

## ブラウザ互換性

### 必須機能
- ES6+ サポート
- Web Audio API
- LocalStorage API
- Fetch API
- FileReader API

### 推奨ブラウザ
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

## パフォーマンス最適化

### ローカルストレージ
- 画像は Base64 エンコード（最大 5MB 推奨）
- 設定は軽量な JSON

### API 呼び出し
- Agent 実行完了のポーリング: 1秒間隔
- 最大 30 回試行（30秒タイムアウト）

### メモリ管理
- Speech SDK の動的ロード（初回のみ）
- 未使用時の recognizer/synthesizer の再利用

## 今後の拡張可能性

1. **マルチモーダル対応**: ビデオストリーミング
2. **履歴管理**: 過去のセッションを保存・復元
3. **カスタムスタイル**: テーマの切り替え
4. **複数言語サポート**: UI の多言語化
5. **アクセシビリティ**: スクリーンリーダー対応
6. **分析**: 使用統計の収集

## トラブルシューティング

### よくある問題

1. **Speech SDK がロードできない**
   - ネットワーク接続を確認
   - ブラウザのコンソールでエラーを確認

2. **マイクが動作しない**
   - ブラウザのマイク許可を確認
   - HTTPS 環境で実行（LocalStorage では HTTP も可）

3. **Agent Service に接続できない**
   - エンドポイント URL を確認
   - Entra ID トークンの有効期限を確認
   - CORS 設定を確認

4. **Personal Voice が動作しない**
   - Speaker Profile ID を確認
   - 言語設定が正しいか確認
   - SSML フォーマットを確認

## 開発者向け情報

### ローカル開発
```bash
# リポジトリをクローン
git clone https://github.com/tokawa-ms/Personal-Voice-Agent-Demo.git
cd Personal-Voice-Agent-Demo

# ブラウザで開く
# ファイル → 開く → src/index.html
```

### デバッグ
- ブラウザの開発者ツールでコンソールログを確認
- Network タブで API 通信を監視
- LocalStorage の内容を確認: Application タブ

### ログレベル
すべての主要な操作でコンソールログを出力しており、以下の情報が記録されます:
- 初期化処理
- 設定の読み込み/保存
- API 呼び出し
- 音声認識イベント
- エラー情報

---

**作成日**: 2025-10-28  
**バージョン**: 1.0.0  
**作成者**: GitHub Copilot Agent
