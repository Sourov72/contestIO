// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { firebase } from "firebase/st"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVtlnmtmmzxnfxN57Bpm9yi0v3TmUe2co",
  authDomain: "contestiofileserver.firebaseapp.com",
  projectId: "contestiofileserver",
  storageBucket: "contestiofileserver.appspot.com",
  messagingSenderId: "816017596903",
  appId: "1:816017596903:web:61e4ae8b577437ce5f5d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
