// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwS8rX_k77Q78NEhZsKC-4Hrl533eV540",
  authDomain: "nunowise-a.firebaseapp.com",
  projectId: "nunowise-a",
  storageBucket: "nunowise-a.firebasestorage.app",
  messagingSenderId: "247360113642",
  appId: "1:247360113642:web:e8b23fedb9d2baa62b8093",
  measurementId: "G-8LXTWN8GNF"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);