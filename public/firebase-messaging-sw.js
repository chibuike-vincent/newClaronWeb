importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
  authDomain: "fcm-notify-db9b8.firebaseapp.com",
  databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
  projectId: "fcm-notify-db9b8",
  storageBucket: "fcm-notify-db9b8.appspot.com",
  messagingSenderId: "77071010064",
  appId: "1:77071010064:web:b20aa04838db1e16e27d95",
  measurementId: "G-VFLB32265E"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png'
  };
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});