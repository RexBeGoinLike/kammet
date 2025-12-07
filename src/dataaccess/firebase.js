import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNlutDtWbVhSfwmvsZ80DdDwlqVaZtqws",
  authDomain: "kammet-27b63.firebaseapp.com",
  projectId: "kammet-27b63",
  storageBucket: "kammet-27b63.firebasestorage.app",
  messagingSenderId: "1042401661790",
  appId: "1:1042401661790:web:e5cc5c255c87335708b5cf",
  measurementId: "G-SZN11EFDR6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };