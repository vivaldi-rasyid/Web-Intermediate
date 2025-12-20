const AboutPage = {
  async render() {
    return `
      <section class="container">
        <h2>About Us</h2>
        <p>Aplikasi Story App ini dibuat untuk memenuhi submission Dicoding.</p>
        <p>Dibangun dengan oleh Muhammad Vivaldi Rasyid.</p>
      </section>
    `;
  },

  async afterRender() {
    // Tidak ada logika khusus
  },
};

export default AboutPage;