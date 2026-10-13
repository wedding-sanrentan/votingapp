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


## 追加済み機能（完全版）

- 第7〜10問のみをWebアプリで管理
- 回答受付中の問題だけ問題文・選択肢・回答欄を表示
- 締切中の問題内容は参加者画面では非表示
- チーム変更ボタンは削除
- 同じチームの再回答は最後の送信で上書き
- 選択中の問題だけリセット可能
- 第7〜10問を一括リセット可能
- リセット時は回答データを削除し、`isOpen: false` に戻す
- リセット時に `resetToken` を更新し、参加者端末の保存済み回答もクリア
- `answerKeys`（正解データ）はリセットしても削除しない

### リセットについて

管理画面の「選択中の問題をリセット」または「全問題をリセット」を使用します。
リセット後は問題が回答締切状態に戻ります。再テスト時は「回答受付を開始」を押してください。
