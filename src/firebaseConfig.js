// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
  authDomain: "fcm-notify-db9b8.firebaseapp.com",
  databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
  projectId: "fcm-notify-db9b8",
  storageBucket: "fcm-notify-db9b8.appspot.com",
  messagingSenderId: "77071010064",
  appId: "1:77071010064:web:b20aa04838db1e16e27d95",
  measurementId: "G-VFLB32265E"
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getTokenFn = () => {
    return getToken(messaging, {vapidKey: 'BHOy1wXMZwd0Mdy8EXQMA4qsV3sEzFmB34sqNjsSifcjQpTfIymePD2EpfXjGi20U5R7ZBAozUz66GFbBekno04'}).then((currentToken) => {
      if (currentToken) {
        console.log('Token generated.', currentToken);
        return currentToken
        // shows on the UI that permission is required 
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
    });
  }


  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

export default firebaseApp

