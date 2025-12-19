import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';

import App from './pages/app';
import MapIconFix from './utils/map-icon-fix';
import { Workbox } from 'workbox-window';
import CONFIG from './config';
import StoryApi from './data/api';
import Auth from './utils/auth';

// Memperbaiki icon marker Leaflet yang kadang hilang
MapIconFix();

const app = new App({
  content: document.querySelector('#main-content'),
  drawerButton: document.querySelector('#drawer-button'),
  navigationDrawer: document.querySelector('#navigation-drawer'),
});

document.addEventListener('DOMContentLoaded', async () => {
  await app.renderPage();
  
  // Minta izin notifikasi saat aplikasi pertama kali dimuat
  await requestNotificationPermission();
});

document.addEventListener('auth-change', () => {
  app.updateNav();
});

window.addEventListener('hashchange', async () => {
  await app.renderPage();
});

// --- LOGIKA SERVICE WORKER (PWA) ---
if ('serviceWorker' in navigator) {
  const wb = new Workbox('./sw.js');
  
  wb.register().then(() => {
    console.log('Service Worker registered');
  }).catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}

// --- LOGIKA PUSH NOTIFICATION (KRITERIA 2) ---

// 1. Helper untuk mengubah VAPID Key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// 2. Fungsi Utama Inisialisasi Notifikasi
const initPushNotification = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung di browser ini.');
    return;
  }
  
  if (!('PushManager' in window)) {
    console.log('Push Manager tidak didukung di browser ini.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Cek apakah user sudah subscribe sebelumnya
    let subscription = await registration.pushManager.getSubscription();
    
    // Jika belum, lakukan subscribe ke Browser (Chrome/Firefox)
    if (!subscription) {
      console.log('Melakukan subscribe ke Push Manager...');
      
      // Pastikan PUSH_MSG_VAPID_PUBLIC_KEY ada di config.js
      if (!CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY) {
        console.error('VAPID Key belum dipasang di config.js!');
        return;
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
      });
    }

    // 3. KIRIM DATA SUBSCRIPTION KE SERVER DICODING (Permintaan Reviewer)
    // Kita hanya kirim jika User sedang Login (punya Token)
    if (Auth.getToken()) {
      const subscriptionJson = subscription.toJSON();
      
      // Format data sesuai spesifikasi API Dicoding
      const subscriptionData = {
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys.p256dh,
          auth: subscriptionJson.keys.auth
        }
      };

      await StoryApi.subscribePush(subscriptionData);
      console.log('Berhasil subscribe notifikasi ke server Dicoding!');
    } else {
      console.log('User belum login, skip kirim subscription ke server.');
    }

  } catch (error) {
    console.error('Gagal melakukan subscribe push notification:', error);
  }
};

// 3. Fungsi Meminta Izin
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi.');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Izin notifikasi diberikan.');
      await initPushNotification(); // Jalankan logika subscribe
    } else {
      console.log('Izin notifikasi ditolak.');
    }
  } catch (error) {
    console.error('Error saat meminta izin notifikasi:', error);
  }
};