// Firebase init. Config is public; access is enforced by Firestore rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc, updateDoc,
  arrayUnion, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8GaoZ5aUIAB-OkwD8bJCCK6JcCLjmZYw",
  authDomain: "nut2001-8a3cd.firebaseapp.com",
  projectId: "nut2001-8a3cd",
  storageBucket: "nut2001-8a3cd.firebasestorage.app",
  messagingSenderId: "860671407813",
  appId: "1:860671407813:web:d77d927ba793622b4762ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export {
  signInWithPopup, signOut, onAuthStateChanged,
  collection, addDoc, deleteDoc, doc, updateDoc,
  arrayUnion, query, orderBy, onSnapshot, serverTimestamp
};

// Paste your Firebase Auth UID here after first sign-in. Until set, no one
// can delete posts. Find it in Firebase Console -> Authentication -> Users.
export const OWNER_UID = "gQVrUpGUKnNHRYYbHyIxjp2HEkt2";
