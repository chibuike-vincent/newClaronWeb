// importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

// const config = {
//   apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
//   authDomain: "fcm-notify-db9b8.firebaseapp.com",
//   databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
//   projectId: "fcm-notify-db9b8",
//   storageBucket: "fcm-notify-db9b8.appspot.com",
//   messagingSenderId: "77071010064",
//   appId: "1:77071010064:web:b20aa04838db1e16e27d95",
//   measurementId: "G-VFLB32265E"
// };

// firebase.initializeApp(config);

// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(payload => {
//   const title = payload.data.title;
//   const options = {
//     body: payload.data.score
//   };
//   return self.registration.showNotification(title, options);
// });

// // messaging.onBackgroundMessage(function(payload) {
// //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     // icon: '/firebase-logo.png'
// //   };
// //   return self.registration.showNotification(notificationTitle,
// //     notificationOptions);
// // });

// self.addEventListener('notificationclick', event => {
//   console.log(event)
//   return event;
// });


// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
// var firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});