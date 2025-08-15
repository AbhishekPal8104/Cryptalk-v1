# CrypTalk — Secure Messaging App

CrypTalk is a React Native messaging application built with end-to-end in-app encryption and decryption, designed as a cybersecurity project. It provides real-time, secure communication with authentication and data storage handled by Firebase Authentication and Cloud Firestore.

---

## Features

- **User Authentication**
  - Register new users securely
  - Login and logout functionality
  - Firebase Authentication integration

- **Secure Messaging**
  - In-app AES/RSA-based encryption before sending
  - In-app decryption after receiving
  - Real-time message updates with Firestore

- **User Interface**
  - Modern, minimal UI for smooth chat experience
  - Real-time message threads
  - Read receipts and timestamps

- **Database and Storage**
  - Cloud Firestore for storing encrypted messages
  - Firebase Storage (optional) for profile images and media

- **Cybersecurity-Focused**
  - No plaintext messages stored in the database
  - Encryption keys handled securely within the app

---

## Tech Stack

- Frontend: React Native (Expo)
- Backend and Auth: Firebase Authentication
- Database: Cloud Firestore
- Encryption: AES or RSA (crypto-js)
- State Management: React Hooks or Context API

---

## Project Structure

- **/src/components** — Reusable UI components  
- **/src/screens** — App screens (Login, Register, Chat, etc.)  
- **/src/utils** — Encryption/Decryption helpers  
- **/src/firebase.ts** — Firebase configuration  
- **/src/App.ts** — Entry point  

## Set up Firebase

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)  
- Enable **Authentication** (Email/Password)  
- Enable **Cloud Firestore**  
- Copy your Firebase configuration and replace it in `firebase.ts`  

## Encryption Details

- **Algorithm:** AES-256 or RSA for secure encryption  
- Messages are **encrypted before sending** to Firestore  
- Decryption happens **only on the recipient's device**  
- No plaintext messages are stored in the database  

## License

Feel free to modify and use it for educational purposes.  

## Author

**Abhishek Pal**  
Frontend Developer | Cybersecurity Enthusiast  

