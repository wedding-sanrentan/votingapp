import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPCn-21uoxcc30u6qfeLKzuH21-ixvhEA",
  authDomain: "wedding-sanrentan.firebaseapp.com",
  projectId: "wedding-sanrentan",
  storageBucket: "wedding-sanrentan.firebasestorage.app",
  messagingSenderId: "932132640688",
  appId: "1:932132640688:web:a80d706c8ded42b4d56875",
  measurementId: "G-JPZTG07B53"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
