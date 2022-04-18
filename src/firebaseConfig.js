// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCHVCwbryk5utUO0KE8xAmqD0noTi0hkDQ",
//   authDomain: "fir-withreact-de85b.firebaseapp.com",
//   projectId: "fir-withreact-de85b",
//   storageBucket: "fir-withreact-de85b.appspot.com",
//   messagingSenderId: "844027328973",
//   appId: "1:844027328973:web:300747d4d283ff8e646c84",
//   measurementId: "G-L7EPDXZKYR"
// };

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


// export const askForPermissioToReceiveNotifications = async (registration) => {
//   try {
  
//       const messaging = firebase.messaging();
//       await messaging.onMessage(notification => {
//           console.log('Notification received!', notification);
//           message.info(notification?.data?.title + ':' + notification?.data?.body)
//       });
  
//       const registration = await navigator.serviceWorker
//           .register('firebase-message-sw.js', {scope: "/", updateViaCache: 'none'})
//           .then((registration) => {
//               return registration;
//           }).catch(e => {
//           });
//       await Notification.requestPermission().then((callBack) => {
//           console.log(callBack)
//       }).catch(e => {
//       });
//       const token = await messaging.getToken({
//           vapidKey: 'BHOy1wXMZwd0Mdy8EXQMA4qsV3sEzFmB34sqNjsSifcjQpTfIymePD2EpfXjGi20U5R7ZBAozUz66GFbBekno04',
//           serviceWorkerRegistration: registration
//       });
//       await //send token
  
  
//       console.log('token do usuário:', token);
//       return token;
  
//   } catch (error) {
//       console.error(error);
//   }}





export const getTokenFn = () => {
    return getToken(messaging, {vapidKey: 'BHOy1wXMZwd0Mdy8EXQMA4qsV3sEzFmB34sqNjsSifcjQpTfIymePD2EpfXjGi20U5R7ZBAozUz66GFbBekno04'}).then((currentToken) => {
      if (currentToken) {
        console.log('Token generated.');
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

// import firebase from "firebase/app"
// import 'firebase/messaging';

//     const config = ({
//       apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
//       authDomain: "fcm-notify-db9b8.firebaseapp.com",
//       databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
//       projectId: "fcm-notify-db9b8",
//       storageBucket: "fcm-notify-db9b8.appspot.com",
//       messagingSenderId: "77071010064",
//       appId: "1:77071010064:web:b20aa04838db1e16e27d95",
//       measurementId: "G-VFLB32265E"
//     });

//   firebase.initializeApp(config)

//   let messaging;

//   if (firebase.messaging.isSupported()){
//     messaging = firebase.messaging();
// }
  

//   export const requestFirebaseNotificationPermission = () =>
//   new Promise((resolve, reject) => {
//     messaging.getToken({vapidKey: "BHOy1wXMZwd0Mdy8EXQMA4qsV3sEzFmB34sqNjsSifcjQpTfIymePD2EpfXjGi20U5R7ZBAozUz66GFbBekno04"})
//       .then((firebaseToken) => {
//         console.log(firebaseToken, "firebaseToken ddddd")
//         resolve(firebaseToken);
//       })
//       .catch((err) => firebase/firestore';Listener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       console.log("firebaseToken, firebaseToken ddddd")
//       console.log(payload, "payload")
//       resolve(payload);
//     });
//   });

//   export default firebase



