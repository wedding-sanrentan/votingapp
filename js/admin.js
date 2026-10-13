import { auth, db } from "./firebase.js";
import { TEAMS, QUESTIONS } from "./questions.js";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const loginSection = document.getElementById("admin-login");
const dashboard = document.getElementById("admin-dashboard");
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const loginMessage = document.getElementById("login-message");

const questionSelect = document.getElementById("admin-question-select");
const controlStatus = document.getElementById("admin-control-status");
const openButton = document.getElementById("open-button");
const closeButton = document.getElementById("close-button");
const answeredCount = document.getElementById("answered-count");
const teamCount = document.getElementById("team-count");
const answerKeyStatus = document.getElementById("answer-key-status");
const answersTableBody = document.getElementById("answers-table-body");
const refreshRankingButton = document.getElementById("refresh-ranking-button");
const leaderboard = document.getElementById("leaderboard");

let unsubscribeControl = null;
let unsubscribeAnswers = null;
let currentAnswerKey = null;
let currentAnswers = new Map();

function currentQuestion() {
  return QUESTIONS.find((question) => question.id === questionSelect.value) || QUESTIONS[0];
}

function choiceText(question, choiceId) {
  const choice = question.choices.find((item) => item.id === choiceId);
  return choice ? `${choice.id} ${choice.text}` : choiceId || "-";
}

function calculateScore(answer, correct) {
  if (!Array.isArray(answer) || !Array.isArray(correct) || answer.length !== 3 || correct.length !== 3) {
    return null;
  }

  if (
    answer[0] === correct[0] &&
    answer[1] === correct[1] &&
    answer[2] === correct[2]
  ) {
    return 6;
  }

  const matchCount = answer.filter((value) => correct.includes(value)).length;

  if (matchCount === 3) {
    return 4;
  }

  if (answer[0] === correct[0] && answer[1] === correct[1]) {
    return 3;
  }

  if (matchCount >= 2) {
    return 2;
  }

  if (answer[0] === correct[0]) {
    return 1;
  }

  return 0;
}

function formatTimestamp(value) {
  if (!value || typeof value.toDate !== "function") return "-";
  return value.toDate().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function renderAnswerTable() {
  const question = currentQuestion();
  answersTableBody.innerHTML = "";

  let count = 0;

  TEAMS.forEach((team) => {
    const data = currentAnswers.get(team.id);
    const tr = document.createElement("tr");

    if (data) count += 1;

    const score = data && currentAnswerKey
      ? calculateScore(data.ranking, currentAnswerKey)
      : null;

    tr.innerHTML = `
      <td><strong>${team.name}</strong></td>
      <td class="${data ? "answer-yes" : "answer-no"}">${data ? "✅ 回答済み" : "— 未回答"}</td>
      <td>${data ? choiceText(question, data.ranking?.[0]) : "-"}</td>
      <td>${data ? choiceText(question, data.ranking?.[1]) : "-"}</td>
      <td>${data ? choiceText(question, data.ranking?.[2]) : "-"}</td>
      <td class="score">${score === null ? "-" : `${score}点`}</td>
      <td>${data ? formatTimestamp(data.updatedAt) : "-"}</td>
    `;

    answersTableBody.appendChild(tr);
  });

  answeredCount.textContent = String(count);
  teamCount.textContent = String(TEAMS.length);
}

async function loadAnswerKey(questionId) {
  currentAnswerKey = null;

  try {
    const snapshot = await getDoc(doc(db, "answerKeys", questionId));

    if (snapshot.exists() && Array.isArray(snapshot.data()?.ranking)) {
      currentAnswerKey = snapshot.data().ranking;
      answerKeyStatus.textContent = `正解登録済み：${currentAnswerKey.join(" → ")}`;
    } else {
      answerKeyStatus.textContent = "正解が未登録のため、得点は「-」で表示されます。";
    }
  } catch (error) {
    console.error(error);
    answerKeyStatus.textContent = "正解データを取得できませんでした。";
  }

  renderAnswerTable();
}

function watchQuestion() {
  const question = currentQuestion();

  if (unsubscribeControl) unsubscribeControl();
  if (unsubscribeAnswers) unsubscribeAnswers();

  currentAnswers = new Map();
  currentAnswerKey = null;
  renderAnswerTable();

  const controlRef = doc(db, "controls", question.id);

  unsubscribeControl = onSnapshot(
    controlRef,
    (snapshot) => {
      const isOpen = snapshot.exists() && snapshot.data()?.isOpen === true;

      controlStatus.textContent = isOpen ? "🟢 回答受付中" : "🔒 回答締切中";
      controlStatus.className = `status ${isOpen ? "status-open" : "status-closed"}`;
    },
    (error) => {
      console.error(error);
      controlStatus.textContent = "状態を取得できません";
      controlStatus.className = "status status-closed";
    }
  );

  unsubscribeAnswers = onSnapshot(
    collection(db, "answers", question.id, "teams"),
    (snapshot) => {
      currentAnswers = new Map();

      snapshot.forEach((docSnap) => {
        currentAnswers.set(docSnap.id, docSnap.data());
      });

      renderAnswerTable();
      refreshLeaderboard();
    },
    (error) => {
      console.error(error);
      currentAnswers = new Map();
      renderAnswerTable();
    }
  );

  loadAnswerKey(question.id);
}

async function setOpenState(isOpen) {
  const question = currentQuestion();

  try {
    await setDoc(
      doc(db, "controls", question.id),
      {
        isOpen,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (error) {
    console.error(error);
    alert("受付状態を変更できませんでした。Firestoreルールと管理者UIDを確認してください。");
  }
}

async function refreshLeaderboard() {
  const totals = new Map(TEAMS.map((team) => [team.id, 0]));

  try {
    for (const question of QUESTIONS) {
      const [keySnapshot, answersSnapshot] = await Promise.all([
        getDoc(doc(db, "answerKeys", question.id)),
        getDocs(collection(db, "answers", question.id, "teams"))
      ]);

      if (!keySnapshot.exists()) continue;

      const correct = keySnapshot.data()?.ranking;
      if (!Array.isArray(correct)) continue;

      answersSnapshot.forEach((answerDoc) => {
        if (!totals.has(answerDoc.id)) return;

        const score = calculateScore(answerDoc.data()?.ranking, correct);
        if (score !== null) {
          totals.set(answerDoc.id, totals.get(answerDoc.id) + score);
        }
      });
    }

    const rows = TEAMS
      .map((team) => ({
        ...team,
        score: totals.get(team.id) || 0
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "ja"));

    leaderboard.innerHTML = "";

    rows.forEach((row, index) => {
      const div = document.createElement("div");
      div.className = "leader-row";
      div.innerHTML = `
        <div class="leader-rank">${index + 1}位</div>
        <div class="leader-name">${row.name}</div>
        <div class="leader-score">${row.score}点</div>
      `;
      leaderboard.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    leaderboard.innerHTML = `<p class="subtle">総合ランキングを取得できませんでした。</p>`;
  }
}

QUESTIONS.forEach((question) => {
  const option = document.createElement("option");
  option.value = question.id;
  option.textContent = `第${question.number}問`;
  questionSelect.appendChild(option);
});

teamCount.textContent = String(TEAMS.length);

loginButton.addEventListener("click", async () => {
  loginMessage.textContent = "ログイン中…";
  loginMessage.className = "message";

  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    loginMessage.textContent = "";
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "ログインできませんでした。メールアドレスとパスワードを確認してください。";
    loginMessage.className = "message error";
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginButton.click();
  }
});

logoutButton.addEventListener("click", () => signOut(auth));
questionSelect.addEventListener("change", watchQuestion);
openButton.addEventListener("click", () => setOpenState(true));
closeButton.addEventListener("click", () => setOpenState(false));
refreshRankingButton.addEventListener("click", refreshLeaderboard);

onAuthStateChanged(auth, (user) => {
  if (user && !user.isAnonymous) {
    loginSection.hidden = true;
    dashboard.hidden = false;
    logoutButton.hidden = false;
    watchQuestion();
    refreshLeaderboard();
  } else {
    loginSection.hidden = false;
    dashboard.hidden = true;
    logoutButton.hidden = true;

    if (unsubscribeControl) unsubscribeControl();
    if (unsubscribeAnswers) unsubscribeAnswers();
  }
});

async function resetCurrentQuestion() {

  const question = currentQuestion();

  const ok = confirm(
    `第${question.number}問の回答をすべて削除します。\n` +
    `この操作は元に戻せません。\n\n` +
    `リセットしますか？`
  );

  if (!ok) {
    return;
  }


  resetQuestionButton.disabled = true;
  resetAllButton.disabled = true;


  try {

    const batch = writeBatch(db);

    // この問題の全チーム回答を取得
    const answersSnapshot =
      await getDocs(
        collection(
          db,
          "answers",
          question.id,
          "teams"
        )
      );


    // 回答を全部削除
    answersSnapshot.forEach((answerDoc) => {
      batch.delete(answerDoc.ref);
    });


    // 問題を締切状態へ戻す
    // resetToken は参加者端末の回答表示クリア用
    const controlRef =
      doc(
        db,
        "controls",
        question.id
      );

    batch.set(
      controlRef,
      {
        isOpen: false,
        resetToken: Date.now()
      },
      {
        merge: true
      }
    );


    await batch.commit();


    alert(
      `第${question.number}問をリセットしました。`
    );

  } catch (error) {

    console.error(error);

    alert(
      "リセットに失敗しました。"
    );

  } finally {

    resetQuestionButton.disabled = false;
    resetAllButton.disabled = false;

  }
}
