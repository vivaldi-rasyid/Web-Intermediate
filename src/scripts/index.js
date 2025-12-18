import 'leaflet/dist/leaflet.css'; 
import '../styles/styles.css';

import App from './pages/app';
import MapIconFix from './utils/map-icon-fix';

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