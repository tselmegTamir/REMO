// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBaw2gvsfmaqkZm_HctG9H_1dZZmkloh8",
    authDomain: "remo-f526e.firebaseapp.com",
    projectId: "remo-f526e",
    storageBucket: "remo-f526e.firebasestorage.app",
    messagingSenderId: "281706044512",
    appId: "1:281706044512:web:e0bce34c53779c13d7f705",
    measurementId: "G-990Q4Z5EJ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
