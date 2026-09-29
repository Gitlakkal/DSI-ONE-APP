import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCThdKxBd-vBmw6z-DYMIzVsTIdivMCF-8",
  authDomain: "dsi-web-app.firebaseapp.com",
  projectId: "dsi-web-app",
  storageBucket: "dsi-web-app.firebasestorage.app",
  messagingSenderId: "247076619964",
  appId: "1:247076619964:web:9e05ed022c84136ec6b2b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase Authentication only
export const auth = getAuth(app);
