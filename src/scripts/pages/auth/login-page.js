import StoryApi from '../../data/api';
import Auth from '../../utils/auth';

const LoginPage = {
  async render() {
    return `
      <section class="container auth-container">
        <h1 class="auth-title">Login</h1>
        <form id="loginForm" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" required placeholder="Masukkan email Anda">
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-control" required placeholder="Masukkan password Anda">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
        <p class="auth-footer">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      </section>
    `;
  },

  async afterRender() {
    const loginForm = document.querySelector('#loginForm');
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await StoryApi.login({ email, password });
        
        if (!response.error) {
          Auth.storeToken(response.loginResult.token);
          Auth.storeUser(response.loginResult.name);
          
          alert('Login berhasil!');

          window.dispatchEvent(new Event('auth-change'));
          
          window.location.hash = '#/';
        } else {
          alert(`Login gagal: ${response.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat login.');
      }
    });
  },
};

export default LoginPage;