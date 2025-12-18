import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import Auth from '../utils/auth';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this.updateNav();
    this._setupLogout();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupLogout() {
    const logoutButton = document.querySelector('#nav-logout');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      Auth.removeToken();
      document.dispatchEvent(new Event('auth-change')); 
      window.location.hash = '#/login';
      this.#navigationDrawer.classList.remove('open');
    });
  }

  updateNav() {
    const token = Auth.getToken();
    const navLogin = document.querySelector('#nav-login');
    const navRegister = document.querySelector('#nav-register');
    const navAddStory = document.querySelector('#nav-add-story');
    const navLogout = document.querySelector('#nav-logout');

    if (token) {
      navLogin.style.display = 'none';
      navRegister.style.display = 'none';
      navAddStory.style.display = 'list-item';
      navLogout.style.display = 'list-item';
    } else {
      navLogin.style.display = 'list-item';
      navRegister.style.display = 'list-item';
      navAddStory.style.display = 'none';
      navLogout.style.display = 'none';
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    
    const protectedRoutes = ['/', '/add-story'];
    const isProtected = protectedRoutes.includes(url);
    
    if (isProtected && !Auth.getToken()) {
      window.location.hash = '#/login';
      return;
    }
    
    const authRoutes = ['/login', '/register'];
    if (authRoutes.includes(url) && Auth.getToken()) {
      window.location.hash = '#/';
      return;
    }

    const page = routes[url] || routes['/'];

    const renderContent = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (event) => {
          event.preventDefault();
          document.querySelector('#main-content').focus();
        });
      }
    };

    if (document.startViewTransition) {
      try {
        const transition = document.startViewTransition(async () => {
          this.#content.innerHTML = '<h2>Loading...</h2>'; 
          await renderContent();
        });

        await transition.finished;
      } catch (err) {
        console.warn('VT API gagal, fallback manual.', err);
        this.#content.innerHTML = '<h2>Loading...</h2>';
        await renderContent();
      }
    } else {
      this.#content.innerHTML = '<h2>Loading...</h2>';
      await renderContent();
    }
    this.updateNav();
  }
}

export default App;