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

- 参加者の問題画面上部に得点ルールを常時表示（6点を黄色で強調）

### リセットについて

管理画面の「選択中の問題をリセット」または「全問題をリセット」を使用します。
リセット後は問題が回答締切状態に戻ります。再テスト時は「回答受付を開始」を押してください。


## スマホUI改善

- 得点ルールを回答カードの外側・上部に独立した表形式で表示
- 6点条件を黄色で強調
- 締切メッセージはスマホで「回答を受け付けていません。」が途中改行されにくい表示に調整


## 管理ユーザーの設定（重要）

この完全版では、管理者UIDを `firestore.rules` に直接書きません。
Firestore の `admins/{UID}` ドキュメントが存在するユーザーだけを管理者として扱います。

### 初回設定 / 管理者変更

1. Firebase Console → Authentication → Users を開く
2. 管理者にしたいユーザーの UID をコピーする
3. Firestore Database → データ を開く
4. `admins` コレクションを作成する
5. ドキュメントIDを「管理者のUID」にする
6. フィールドを1つ追加する
   - フィールド: `enabled`
   - 型: boolean
   - 値: `true`
7. Firestore Database → ルール を開く
8. このZIPの `firestore.rules` の内容を貼り付けて「公開」する

例:

admins
└─ abcDEF123456...
   └─ enabled: true

管理者を変更するときは、古いUIDのドキュメントを削除し、新しいUIDのドキュメントを作成します。
GitHubのコード変更は不要です。

### 注意

GitHub Pages に `firestore.rules` をアップロードするだけでは、Firebase のルールは変更されません。
必ず Firebase Console の Firestore → ルール画面で貼り付けて「公開」してください。
