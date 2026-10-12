// ここを本番用のチーム名・問題文・選択肢へ書き換えます。
// id は Firestore 上のキーとして使うため、公開後はなるべく変更しないでください。

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

const placeholderChoices = [
  { id: "A", text: "選択肢A" },
  { id: "B", text: "選択肢B" },
  { id: "C", text: "選択肢C" },
  { id: "D", text: "選択肢D" },
  { id: "E", text: "選択肢E" },
  { id: "F", text: "選択肢F" },
  { id: "G", text: "選択肢G" }
];

export const QUESTIONS = [
  {
    id: "q1",
    number: 1,
    title: "問題1（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
  {
    id: "q2",
    number: 2,
    title: "問題2（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
  {
    id: "q3",
    number: 3,
    title: "問題3（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
  {
    id: "q4",
    number: 4,
    title: "問題4（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
  {
    id: "q5",
    number: 5,
    title: "問題5（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
  {
    id: "q6",
    number: 6,
    title: "問題6（ここを本番の問題文へ変更）",
    choices: placeholderChoices
  },
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
  }
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
  title: "第9問（作成中）",
  choices: [
    { id: "A", text: "選択肢A" },
    { id: "B", text: "選択肢B" },
    { id: "C", text: "選択肢C" },
    { id: "D", text: "選択肢D" },
    { id: "E", text: "選択肢E" },
    { id: "F", text: "選択肢F" }
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
