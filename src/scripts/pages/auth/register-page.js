import StoryApi from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Register</h1>
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8">
          </div>
          <button type="submit">Register</button>
          <p class="auth-switch">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          <p id="error-message" class="error-message" aria-live="polite"></p>
          <p id="success-message" class="success-message" aria-live="polite"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.title = 'Register - App';
    const registerForm = document.querySelector('#register-form');
    const errorMessage = document.querySelector('#error-message');
    const successMessage = document.querySelector('#success-message');

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      errorMessage.textContent = '';
      successMessage.textContent = '';

      try {
        const response = await StoryApi.register({ name, email, password });
        if (response.error) {
          throw new Error(response.message);
        }

        successMessage.textContent = 'Registrasi berhasil! Silakan login.';
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (error) {
        errorMessage.textContent = `Registrasi Gagal: ${error.message}`;
      }
    });
  }
}