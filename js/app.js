import { auth, db } from "./firebase.js";
import { TEAMS, QUESTIONS } from "./questions.js";

import {
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const loadingScreen = document.getElementById("loading-screen");
const teamScreen = document.getElementById("team-screen");
const questionScreen = document.getElementById("question-screen");
const teamSelect = document.getElementById("team-select");
const startButton = document.getElementById("start-button");
const questionContent =
  document.getElementById("question-content");

const closedMessage =
  document.getElementById("closed-message");

const questionNumber = document.getElementById("question-number");
const questionTitle = document.getElementById("question-title");
const teamBadge = document.getElementById("team-badge");
const choiceList = document.getElementById("choice-list");

const rank1 = document.getElementById("rank1");
const rank2 = document.getElementById("rank2");
const rank3 = document.getElementById("rank3");

const statusBox = document.getElementById("status");
const messageBox = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

let selectedTeam = null;
let currentQuestionIndex = 0;
let isQuestionOpen = false;
let unsubscribeControl = null;

function showMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`.trim();
}

function getSavedAnswer(questionId) {
  try {
    return JSON.parse(localStorage.getItem(`answer:${questionId}`)) || null;
  } catch {
    return null;
  }
}

function saveLocalAnswer(questionId, ranking) {
  localStorage.setItem(`answer:${questionId}`, JSON.stringify(ranking));
}

function populateTeams() {
  TEAMS.forEach((team) => {
    const option = document.createElement("option");
    option.value = team.id;
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });
}

function fillRankSelect(selectElement, choices, selectedValue = "") {
  selectElement.innerHTML = "";

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "選択してください";
  selectElement.appendChild(blank);

  choices.forEach((choice) => {
    const option = document.createElement("option");
    option.value = choice.id;
    option.textContent = `${choice.id}  ${choice.text}`;
    option.selected = choice.id === selectedValue;
    selectElement.appendChild(option);
  });
}

function renderChoices(question) {
  choiceList.innerHTML = "";

  question.choices.forEach((choice) => {
    const row = document.createElement("div");
    row.className = "choice-item";

    const key = document.createElement("div");
    key.className = "choice-key";
    key.textContent = choice.id;

    const text = document.createElement("div");
    text.textContent = choice.text;

    row.append(key, text);
    choiceList.appendChild(row);
  });
}

function updateStatusUi() {

  const question =
    QUESTIONS[currentQuestionIndex];

  if (isQuestionOpen) {

    // 問題を表示
    closedMessage.hidden = true;
    questionContent.hidden = false;

    questionTitle.textContent =
      question.title;

    renderChoices(question);

    const saved =
      getSavedAnswer(question.id);

    fillRankSelect(
      rank1,
      question.choices,
      saved?.[0] || ""
    );

    fillRankSelect(
      rank2,
      question.choices,
      saved?.[1] || ""
    );

    fillRankSelect(
      rank3,
      question.choices,
      saved?.[2] || ""
    );

    statusBox.textContent =
      "🟢 回答受付中";

    statusBox.className =
      "status status-open";

  } else {

    // 締切中は問題情報を消す
    questionContent.hidden = true;
    closedMessage.hidden = false;

    questionTitle.textContent = "";
    choiceList.innerHTML = "";

    rank1.innerHTML = "";
    rank2.innerHTML = "";
    rank3.innerHTML = "";

  }

  validateAnswer();
}

  validateAnswer();
}

function validateAnswer() {
  const values = [rank1.value, rank2.value, rank3.value];
  const allSelected = values.every(Boolean);
  const unique = new Set(values).size === 3;

  submitButton.disabled = !(isQuestionOpen && allSelected && unique);

  if (allSelected && !unique) {
    showMessage("1位・2位・3位には別々の選択肢を選んでください。", "error");
  } else if (messageBox.textContent.includes("別々の選択肢")) {
    showMessage("");
  }
}

function watchControl(questionId) {

  if (unsubscribeControl) {

    unsubscribeControl();
    unsubscribeControl = null;

  }


  isQuestionOpen = false;
  updateStatusUi();


  const controlRef =
    doc(
      db,
      "controls",
      questionId
    );


unsubscribeControl =
  onSnapshot(
    controlRef,

    (snapshot) => {

      const data =
        snapshot.data();

      isQuestionOpen =
        snapshot.exists() &&
        data?.isOpen === true;


      // 管理画面からリセットされたか確認
      const resetToken =
        data?.resetToken;


      if (resetToken) {

        const resetKey =
          `resetToken:${questionId}`;

        const savedResetToken =
          localStorage.getItem(
            resetKey
          );


        if (
          savedResetToken !==
          String(resetToken)
        ) {

          // この問題の端末内回答を削除
          localStorage.removeItem(
            `answer:${questionId}`
          );


          // 最新のリセット番号を保存
          localStorage.setItem(
            resetKey,
            String(resetToken)
          );


          // 回答欄もクリア
          rank1.value = "";
          rank2.value = "";
          rank3.value = "";

          showMessage("");

        }

      }


      updateStatusUi();

    },

    (error) => {

      console.error(error);

      isQuestionOpen = false;

      updateStatusUi();

    }
  );

function showQuestion() {

  const question =
    QUESTIONS[currentQuestionIndex];

  // 別の問題へ移動した瞬間は
  // まず問題内容をすべて隠す
  isQuestionOpen = false;

  questionContent.hidden = true;
  closedMessage.hidden = false;

  questionTitle.textContent = "";
  choiceList.innerHTML = "";

  rank1.innerHTML = "";
  rank2.innerHTML = "";
  rank3.innerHTML = "";

  showMessage("");


  // 問題番号
  if (question.id === "q10") {

    questionNumber.textContent =
      "FINAL QUESTION";

  } else {

    questionNumber.textContent =
      `QUESTION ${question.number} / 10`;

  }


  teamBadge.textContent =
    `チーム：${selectedTeam.name}`;


  previousButton.disabled =
    currentQuestionIndex === 0;

  nextButton.disabled =
    currentQuestionIndex ===
    QUESTIONS.length - 1;


  // Firestoreの受付状態を確認
  watchControl(question.id);
}

async function submitAnswer() {
  const question = QUESTIONS[currentQuestionIndex];
  const ranking = [rank1.value, rank2.value, rank3.value];

  if (!isQuestionOpen) {
    showMessage("この問題は締め切られています。", "error");
    return;
  }

  if (ranking.some((value) => !value) || new Set(ranking).size !== 3) {
    showMessage("1位〜3位を重複なしで選択してください。", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("送信中です…");

  try {
    const answerRef = doc(db, "answers", question.id, "teams", selectedTeam.id);

    await setDoc(answerRef, {
      teamId: selectedTeam.id,
      questionId: question.id,
      ranking,
      writerUid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    });

    saveLocalAnswer(question.id, ranking);
    showMessage("回答を登録しました。最後に送信された回答が採用されます。", "success");
  } catch (error) {
    console.error(error);

    if (error?.code === "permission-denied") {
      showMessage("送信直前に締め切られたため、回答は登録されませんでした。", "error");
    } else {
      showMessage("回答を送信できませんでした。通信状況をご確認ください。", "error");
    }
  } finally {
    validateAnswer();
  }
}

function enterGame(teamId) {
  selectedTeam = TEAMS.find((team) => team.id === teamId);

  if (!selectedTeam) {
    return;
  }

  localStorage.setItem("weddingTeam", selectedTeam.id);
  teamScreen.hidden = true;
  questionScreen.hidden = false;
  showQuestion();
}

populateTeams();

startButton.addEventListener("click", () => {
  if (!teamSelect.value) {
    alert("チームを選択してください。");
    return;
  }

  enterGame(teamSelect.value);
});

[rank1, rank2, rank3].forEach((select) => {
  select.addEventListener("change", validateAnswer);
});

submitButton.addEventListener("click", submitAnswer);

previousButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    showQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < QUESTIONS.length - 1) {
    currentQuestionIndex += 1;
    showQuestion();
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  loadingScreen.hidden = true;

  const savedTeamId = localStorage.getItem("weddingTeam");
  const savedTeam = TEAMS.find((team) => team.id === savedTeamId);

  if (savedTeam) {
    teamSelect.value = savedTeam.id;
    enterGame(savedTeam.id);
  } else {
    teamScreen.hidden = false;
  }
});

try {
  await signInAnonymously(auth);
} catch (error) {
  console.error(error);
  loadingScreen.innerHTML = `
    <h2>接続できませんでした</h2>
    <p>Firebase Authentication の「匿名」が有効になっているか確認してください。</p>
  `;
}
