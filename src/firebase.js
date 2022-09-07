import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBsp6emsgpV2LFX_iQBnrGO3kWa7MUjHO4",
  authDomain: "busy-app-8e682.firebaseapp.com",
  databaseURL: "https://busy-app-8e682-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "busy-app-8e682",
  storageBucket: "busy-app-8e682.appspot.com",
  messagingSenderId: "929719331841",
  appId: "1:929719331841:web:6de36d5af18425f425a400",
  measurementId: "G-XSNQZHB9TK"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

  