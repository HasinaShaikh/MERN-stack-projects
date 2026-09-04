import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "authexamnotes-6b6e4.firebaseapp.com",
  projectId: "authexamnotes-6b6e4",
  storageBucket: "authexamnotes-6b6e4.firebasestorage.app",
  messagingSenderId: "1023527635639",
  appId: "1:1023527635639:web:90617994d20f835e2c9b32"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export { auth, provider };