// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "inventory-management-858e7.firebaseapp.com",
  projectId: "inventory-management-858e7",
  storageBucket: "inventory-management-858e7.appspot.com",
  messagingSenderId: process.env.PROJECT_NUM,
  appId:  process.env.APP_ID,
  measurementId: "G-NK3VK8NEH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}