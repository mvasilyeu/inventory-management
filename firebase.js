// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqudfmLMFkcPa8iRUyA1Jk07i5Z0l7hTc",
  authDomain: "inventory-management-858e7.firebaseapp.com",
  projectId: "inventory-management-858e7",
  storageBucket: "inventory-management-858e7.appspot.com",
  messagingSenderId: "65264775881",
  appId: "1:65264775881:web:017920e6e7991004039318",
  measurementId: "G-NK3VK8NEH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}