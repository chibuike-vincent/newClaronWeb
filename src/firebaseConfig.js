

import firebase from "firebase/app"
import 'firebase/messaging';

    const config = ({
      apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
      authDomain: "fcm-notify-db9b8.firebaseapp.com",
      databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
      projectId: "fcm-notify-db9b8",
      storageBucket: "fcm-notify-db9b8.appspot.com",
      messagingSenderId: "77071010064",
      appId: "1:77071010064:web:b20aa04838db1e16e27d95"


    });

  firebase.initializeApp(config)

  let messaging;

  if (firebase.messaging.isSupported()){
    messaging = firebase.messaging();
}
  

  export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging.getToken({vapidKey: "BHOy1wXMZwd0Mdy8EXQMA4qsV3sEzFmB34sqNjsSifcjQpTfIymePD2EpfXjGi20U5R7ZBAozUz66GFbBekno04"})
      .then((firebaseToken) => {
        console.log(firebaseToken, "firebaseToken ddddd")
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      console.log(payload, "payload")
      resolve(payload);
    });
  });

  export default firebase

