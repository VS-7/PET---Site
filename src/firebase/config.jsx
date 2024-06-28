import { initializeApp } from "firebase/app";
/*import { getAnalytics } from "firebase/analytics";*/
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyCBCfRHmuc3n2b5_zi2uYEip-IpjUFpjZU",
    authDomain: "pet-conex.firebaseapp.com",
    projectId: "pet-conex",
    storageBucket: "pet-conex.appspot.com",
    messagingSenderId: "377233708284",
    appId: "1:377233708284:web:4107863f4281e99eae7379",
    measurementId: "G-TSNR79TCFJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/*const analytics = getAnalytics(app);*/
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export { db, auth };

