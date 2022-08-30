import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD4N-KmzIIQZ2KHEaOuI5cRLK_z1owkGUA",
    authDomain: "instagram-clone-9786a.firebaseapp.com",
    projectId: "instagram-clone-9786a",
    storageBucket: "instagram-clone-9786a.appspot.com",
    messagingSenderId: "515808429534",
    appId: "1:515808429534:web:d9c09f585ccba3c65bc94f",
    measurementId: "G-V43LDYKCRT"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };

  export default firebase;