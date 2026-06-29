import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLjO9ZUwQrQxjYLYGd0JSDvMTZU_mwqNo",
  authDomain: "vaishnavibday-eeb65.firebaseapp.com",
  databaseURL: "https://vaishnavibday-eeb65-default-rtdb.firebaseio.com",
  projectId: "vaishnavibday-eeb65",
  storageBucket: "vaishnavibday-eeb65.firebasestorage.app",
  messagingSenderId: "1003424002464",
  appId: "1:1003424002464:web:44617d92073da0ddc0f4c5"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function requestNotificationPermission() {
    console.log('Requesting notification permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                    // TODO: Replace 'YOUR_VAPID_KEY_HERE' with your actual VAPID key from Firebase Console
                    getToken(messaging, { 
                        vapidKey: 'BL-9M0N0MM5H874rBfoOBoH8bw4jp8qFlhRePmDpIxrCm9PIkO8AZLENo0cFHHlnfTTVfT3ygpgXnOQM24DwoDA',
                        serviceWorkerRegistration: registration 
                    }).then((currentToken) => {
                        if (currentToken) {
                            console.log('Got FCM device token:', currentToken);
                            alert("Notifications enabled successfully!");
                        } else {
                            console.log('No registration token available.');
                        }
                    }).catch((err) => {
                        console.error('An error occurred while retrieving token. ', err);
                    });
                }).catch((err) => {
                    console.error('Service Worker registration failed:', err);
                });
            } else {
                console.warn('Service workers are not supported by this browser.');
            }
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
}

// Handle incoming messages when the app is OPEN
onMessage(messaging, (payload) => {
    console.log('Message received while app is open:', payload);
    // Show a simple alert or a custom toast notification
    alert(`✨ New Notification!\n\n${payload.notification.title}\n${payload.notification.body}`);
});

// Make it globally available so script.js can call it
window.requestNotificationPermission = requestNotificationPermission;
