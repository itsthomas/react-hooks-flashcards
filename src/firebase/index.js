import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAehGfPEzYsIlAcS3HWwjxgxzoPB29HtS4",
  authDomain: "react-apps-e06b2.firebaseapp.com",
  databaseURL: "https://react-apps-e06b2.firebaseio.com",
  projectId: "react-apps-e06b2",
  storageBucket: "react-apps-e06b2.appspot.com",
  messagingSenderId: "422301719317",
  appId: "1:422301719317:web:f739e6fddc9a718ffd271c"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage(); // for uploading images
const db = firebase.firestore(); // for stings and numbers saved in database

export { storage, db, firebase as default };
