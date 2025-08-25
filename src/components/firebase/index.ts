// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5s1iCU7v9fJt4B9faHb-zvhoKKaqjZwE",
  authDomain: "barbin-furniture.firebaseapp.com",
  projectId: "barbin-furniture",
  storageBucket: "barbin-furniture.firebasestorage.app",
  messagingSenderId: "267443585169",
  appId: "1:267443585169:web:001c2de46704e2041fbf30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);