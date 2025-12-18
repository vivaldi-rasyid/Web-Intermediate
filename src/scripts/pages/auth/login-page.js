import StoryApi from '../../data/api';
import Auth from '../../utils/auth';

export default class LoginPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Login</h1>
        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8">
          </div>
          <button type="submit">Login</button>
          <p class="auth-switch">Belum punya akun? <a href="#/register">Register di sini</a></p>
          <p id="error-message" class="error-message" aria-live="polite"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.title = 'Login - App';
    const loginForm = document.querySelector('#login-form');
    const errorMessage = document.querySelector('#error-message');

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await StoryApi.login({ email, password });
        if (response.error) {
          throw new Error(response.message);
        }

        Auth.setToken(response.loginResult.token);
        document.dispatchEvent(new Event('auth-change')); 
        window.location.hash = '#/';
      } catch (error) {
        errorMessage.textContent = `Login Gagal: ${error.message}`;
      }
    });
  }
}