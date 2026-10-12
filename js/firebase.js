// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
