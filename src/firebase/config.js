import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAqmq83KWccCyFCxtRDWUqrZ2J5-UMabaQ",
  authDomain: "chat-app-e9a3a.firebaseapp.com",
  projectId: "chat-app-e9a3a",
  storageBucket: "chat-app-e9a3a.appspot.com",
  messagingSenderId: "688657647080",
  appId: "1:688657647080:web:093d4d72cc75fec85d905d",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
firebase.analytics();

//TODO: Use Emulator
// if (window.location.hostname === "localhost") {
//   projectAuth.useEmulator("http://localhost:9099");
//   projectFirestore.useEmulator("localhost", "8080");
// }

export { projectFirestore, projectAuth };
export default firebase;
