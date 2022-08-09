import { initializeApp } from 'firebase/app';

import { getFirestore, connectFirestoreEmulator  } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDU1Jqhqg8ggP0biOKfLrsWQkt-1HXCXXo",
  authDomain: "chat-app-f22c9.firebaseapp.com",
  projectId: "chat-app-f22c9",
  storageBucket: "chat-app-f22c9.appspot.com",
  messagingSenderId: "363786990467",
  appId: "1:363786990467:web:6571967b133de3af377cb6",
  measurementId: "G-P7EFBXSFFE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


connectAuthEmulator(auth, 'http://localhost:9099');
if (window.location.hostname === 'localhost') {
  console.log('Connect db successfully')
  connectFirestoreEmulator(db, 'localhost', 8080);
}


export { db, auth, analytics };