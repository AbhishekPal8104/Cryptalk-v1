// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA7RVNxyW5hfByPUEOsneh5scbg63iNqTo",
    authDomain: "cryptalk-6d62d.firebaseapp.com",
    projectId: "cryptalk-6d62d",
    storageBucket: "cryptalk-6d62d.appspot.com",
    messagingSenderId: "418223829356",
    appId: "1:418223829356:web:1e044bba882b715aed0349",
    measurementId: "G-9SFTGPJKML"
};

const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
// });

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
