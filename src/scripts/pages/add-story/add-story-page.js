import StoryApi from '../../data/api';
import L from 'leaflet'; 

const AddStoryPage = {
  async render() {
    return `
      <section class="container add-story-container">
        <h1>Tambah Cerita</h1> 
        <form id="addStoryForm">
          <div class="form-group">
            <label for="description" class="form-label">Deskripsi</label>
            <textarea id="description" class="form-control" required placeholder="Ceritakan pengalamanmu..."></textarea>
          </div>
          <div class="form-group">
             <label for="photo" class="form-label">Foto</label>
             <input type="file" id="photo" class="form-control" accept="image/*" required>
          </div>
          
          <div class="form-group">
             <label class="form-label">Lokasi</label>
             <div id="map" style="height: 300px; width: 100%; margin-bottom: 1rem; border-radius: 4px;"></div>
             <input type="hidden" id="lat">
             <input type="hidden" id="lon">
          </div>

          <button type="submit" class="btn-primary">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker = null;

    // Logic Click Map
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }

      document.querySelector('#lat').value = lat;
      document.querySelector('#lon').value = lng;
    });

    
    const form = document.querySelector('#addStoryForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.querySelector('#description').value;
      const photoInput = document.querySelector('#photo');
      const photo = photoInput.files[0];
      const lat = document.querySelector('#lat').value;
      const lon = document.querySelector('#lon').value;

      if (!photo) {
        alert('Mohon pilih foto terlebih dahulu');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

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