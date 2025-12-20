import StoryApi from '../../data/api';

const RegisterPage = {
  async render() {
    return `
      <section class="container auth-container">
        <h2 class="auth-title">Register</h2>
        <form id="registerForm" class="auth-form">
          <div class="form-group">
            <label for="name" class="form-label">Nama</label>
            <input type="text" id="name" class="form-control" required placeholder="Nama Lengkap">
          </div>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" required placeholder="Email Aktif">
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-control" required minlength="8" placeholder="Minimal 8 karakter">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Daftar</button>
        </form>
        <p class="auth-footer">Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </section>
    `;
  },

  async afterRender() {
    const registerForm = document.querySelector('#registerForm');
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await StoryApi.register({ name, email, password });
        
        if (!response.error) {
          alert('Registrasi berhasil! Silakan login.');
          window.location.hash = '#/login';
        } else {
          alert(`Registrasi gagal: ${response.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat registrasi.');
      }
    });
  },
};

export default RegisterPage;