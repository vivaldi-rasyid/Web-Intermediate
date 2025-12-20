import StoryApi from '../../data/api';

const AddStoryPage = {
  async render() {
    return `
      <section class="container add-story-container">
        <h2>Tambah Cerita</h2>
        <form id="addStoryForm">
          <div class="form-group">
            <label for="description" class="form-label">Deskripsi</label>
            <textarea id="description" class="form-control" required placeholder="Ceritakan pengalamanmu..."></textarea>
          </div>
          <div class="form-group">
             <label for="photo" class="form-label">Foto</label>
             <input type="file" id="photo" class="form-control" accept="image/*" required>
          </div>
          <button type="submit" class="btn-primary">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#addStoryForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.querySelector('#description').value;
      const photoInput = document.querySelector('#photo');
      const photo = photoInput.files[0];

      if (!photo) {
        alert('Mohon pilih foto terlebih dahulu');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);

      try {
        const response = await StoryApi.addNewStory(formData);
        if (!response.error) {
          alert('Cerita berhasil ditambahkan!');
          window.location.hash = '#/';
        } else {
          alert(`Gagal: ${response.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengirim cerita');
      }
    });
  },
};

export default AddStoryPage;