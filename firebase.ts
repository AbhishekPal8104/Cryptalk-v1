// firebase.ts

// this file will not work because i have removed apikey from it to protect it from abuse for now, i will create a .env to make it much secure.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// firebase is free tool for this type of projects so its very easy and practical to use your own firebase for this simply by registering on google firebase.

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
