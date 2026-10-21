// 結婚式二次会「サンレンタン」チーム戦用
// 第1〜6問は個人戦のため、このWebアプリでは管理しません。
// Firestore 上では q7〜q10 を使用します。

export const TEAMS = [
  { id: "team-a", name: "テーブルA" },
  { id: "team-b", name: "テーブルB" },
  { id: "team-c", name: "テーブルC" },
  { id: "team-d", name: "テーブルD" },
  { id: "team-e", name: "テーブルE" },
  { id: "team-f", name: "テーブルF" },
  { id: "team-g", name: "テーブルG" },
  { id: "team-h", name: "テーブルH" }
];

export const QUESTIONS = [
  {
    id: "q7",
    number: 7,
    title: "新婚旅行で行くなら？",
    choices: [
      { id: "A", text: "エジプト" },
      { id: "B", text: "ハワイ" },
      { id: "C", text: "フランス" },
      { id: "D", text: "モンゴル" },
      { id: "E", text: "シンガポール" },
      { id: "F", text: "南極" }
    ]
  },
  {
    id: "q8",
    number: 8,
    title: "住むとしたらどこ？",
    choices: [
      { id: "A", text: "徒歩圏内に温泉があるところ" },
      { id: "B", text: "家賃・物価が異常に安いところ" },
      { id: "C", text: "美味しいラーメン屋が多いところ" },
      { id: "D", text: "最寄り駅に空港と港があるところ" },
      { id: "E", text: "大型ショッピングモールが近くにあるところ" },
      { id: "F", text: "スーパーとジムまで徒歩1分のところ" }
    ]
  },
{
  id: "q9",
  number: 9,
  title: "デートでやりたいことは？",
  choices: [
    { id: "A", text: "夜景を見る" },
    { id: "B", text: "謎解き脱出ゲーム" },
    { id: "C", text: "山手線一周散歩" },
    { id: "D", text: "競馬" },
    { id: "E", text: "食べ歩き" },
    { id: "F", text: "ドライブ" }
  ]
},
  {
    id: "q10",
    number: 10,
    title: "夫婦に大切なことは？",
    choices: [
      { id: "A", text: "感謝と謝罪を伝えること" },
      { id: "B", text: "ひとり時間の確保" },
      { id: "C", text: "話が合うこと" },
      { id: "D", text: "金銭感覚が合うこと" },
      { id: "E", text: "適切な家事分担" },
      { id: "F", text: "共通の趣味があること" }
    ]
  }
];
