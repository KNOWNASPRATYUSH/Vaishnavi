importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCLjO9ZUwQrQxjYLYGd0JSDvMTZU_mwqNo",
  authDomain: "vaishnavibday-eeb65.firebaseapp.com",
  databaseURL: "https://vaishnavibday-eeb65-default-rtdb.firebaseio.com",
  projectId: "vaishnavibday-eeb65",
  storageBucket: "vaishnavibday-eeb65.firebasestorage.app",
  messagingSenderId: "1003424002464",
  appId: "1:1003424002464:web:44617d92073da0ddc0f4c5"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'New Message!';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/img13.png',
    badge: '/images/img13.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
