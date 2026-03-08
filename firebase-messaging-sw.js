// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB-hJ7OBOw0ct1KEuZQqqhQVQAAZIImPYI",
  authDomain: "restaurant-chayxana.firebaseapp.com",
  projectId: "restaurant-chayxana",
  storageBucket: "restaurant-chayxana.firebasestorage.app",
  messagingSenderId: "16727485529",
  appId: "1:16727485529:web:8e1be5c05acf10d4851548",
  measurementId: "G-EKHHCV1GYW"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Fon rejimida bildirishnoma kelganda
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://example.com/icon.png' // agar ikona bo‘lsa, URL ni o‘zgartiring
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});