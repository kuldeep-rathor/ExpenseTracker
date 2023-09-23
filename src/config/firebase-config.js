// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA4k-vtWfkglRvy7Jqwpd-fR0J5r_V4Is",
  authDomain: "expense-tracker-3f5a0.firebaseapp.com",
  projectId: "expense-tracker-3f5a0",
  storageBucket: "expense-tracker-3f5a0.appspot.com",
  messagingSenderId: "763028058493",
  appId: "1:763028058493:web:732b7b9c09c56e2a491c14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
