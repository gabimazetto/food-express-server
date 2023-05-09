// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZrr7bI-ybVvjaJQ-rR_ChYlkC4Kb-2kU",
  authDomain: "food-express-soulcode.firebaseapp.com",
  projectId: "food-express-soulcode",
  storageBucket: "food-express-soulcode.appspot.com",
  messagingSenderId: "344785270534",
  appId: "1:344785270534:web:c88193db17011f57629087"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configura o Storage e seus recursos de Upload
const storage = getStorage(app);

module.exports = { storage };