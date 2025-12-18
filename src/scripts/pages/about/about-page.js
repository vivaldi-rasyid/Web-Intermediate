export default class AboutPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Tentang Story</h1>
        <p style="text-align: center; line-height: 1.6; margin-top: 16px;">
          <strong>Story</strong> adalah sebuah aplikasi sederhana.
          Aplikasi ini memungkinkan pengguna untuk berbagi cerita
          dan menandai lokasi mereka di peta.
        </p>
      </section>
    `;
  }

  async afterRender() {
    document.title = 'About - Story';
  }
}