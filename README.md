# Wedding Sanrentan Voting App

GitHub Pages + Firebase Firestore で動く、結婚式二次会向け「サンレンタン」回答・集計アプリです。

## ファイル

- `index.html` : 参加者用画面
- `admin.html` : 幹事用画面
- `css/style.css` : 黄色ベースの結婚式UI
- `js/firebase.js` : Firebase接続設定
- `js/questions.js` : チーム名・問題文・選択肢
- `js/app.js` : 参加者側処理
- `js/admin.js` : 幹事側処理・採点・集計
- `firestore.rules` : Firestore Security Rules
- `.nojekyll` : GitHub Pages用

## 最初に変更する箇所

### 1. `js/firebase.js`
Firebase Console の Web アプリ設定に表示される `firebaseConfig` へ置き換えてください。

### 2. `js/questions.js`
チーム名、問題文、選択肢を本番用に変更してください。

### 3. `firestore.rules`
`REPLACE_WITH_ADMIN_UID` を Firebase Authentication で作成した幹事ユーザーの UID に変更し、
Firebase Console の Firestore → ルールへ貼り付けて公開してください。

## Firebase 側で必要な設定

1. Authentication で「匿名」を有効化
2. Authentication で「メール / パスワード」を有効化
3. 幹事用ユーザーを1名作成
4. Firestore を作成
5. `controls/q1` などに `isOpen: false` を登録
6. `answerKeys/q1` などに `ranking: ["A","B","C"]` のように正解を登録
7. Firestore Rules を公開

`answers` コレクションは事前作成不要です。参加者の初回回答時に自動生成されます。

## GitHub Pages

リポジトリの Settings → Pages から
`Deploy from a branch` → `main` → `/(root)` を選択してください。

プロジェクトURLの例:
`https://wedding-sanrentan.github.io/votingapp/`

幹事画面:
`https://wedding-sanrentan.github.io/votingapp/admin.html`
