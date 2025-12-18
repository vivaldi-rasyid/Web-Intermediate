import 'leaflet/dist/leaflet.css'; 
import '../styles/styles.css';

import App from './pages/app';
import MapIconFix from './utils/map-icon-fix';
import { Workbox } from 'workbox-window';

MapIconFix();

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  await app.renderPage();
  
  document.addEventListener('auth-change', () => {
    app.updateNav();
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

if ('serviceWorker' in navigator) {
  const wb = new Workbox('./sw.js');

  wb.register();
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications.');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
};

requestNotificationPermission();