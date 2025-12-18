import L from 'leaflet';
import StoryApi from '../../data/api';
import Auth from '../../utils/auth';

export default class AddStoryPage {
  #map = null;
  #marker = null;

  async render() {
    return `
      <section class="container add-story-container">
        <h1>Tambah Cerita Baru</h1>
        <form id="add-story-form" class="add-story-form">
          <div class="form-group">
            <label for="story-image">Upload Foto</label>
            <input type="file" id="story-image" accept="image/*" required>
          </div>
          <div class="form-group">
            <label for="story-description">Deskripsi</label>
            <textarea id="story-description" rows="5" required></textarea>
          </div>
          
          <div class="form-group">
            <p>Pilih Lokasi (Opsional):</p>
            <div id="add-story-map"></div>
          </div>

          <input type="hidden" id="story-lat">
          <input type="hidden" id="story-lon">

          <button type="submit">Submit Cerita</button>
          <p id="error-message" class="error-message" aria-live="polite"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.title = 'Tambah Cerita - App';
    if (!Auth.getToken()) {
      window.location.hash = '#/login';
      return;
    }

    this._initMap();
    this._initFormSubmit();
  }

  _initMap() {
    const defaultCoords = [-6.914744, 107.609810]; 
    this.#map = L.map('add-story-map').setView(defaultCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#marker = L.marker(defaultCoords).addTo(this.#map);

    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.querySelector('#story-lat').value = lat;
      document.querySelector('#story-lon').value = lng;
      
      if (this.#marker) {
        this.#marker.setLatLng(e.latlng);
      } else {
        this.#marker = L.marker(e.latlng).addTo(this.#map);
      }
    });
  }

  _initFormSubmit() {
    const addStoryForm = document.querySelector('#add-story-form');
    const errorMessage = document.querySelector('#error-message');

    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessage.textContent = '';

      const photo = document.querySelector('#story-image').files[0];
      const description = document.querySelector('#story-description').value;
      const lat = document.querySelector('#story-lat').value;
      const lon = document.querySelector('#story-lon').value;

      const formData = new FormData();
      formData.append('photo', photo); 
      formData.append('description', description);
      if (lat && lon) {
        formData.append('lat', parseFloat(lat));
        formData.append('lon', parseFloat(lon));
      }

      try {
        const response = await StoryApi.addNewStory(formData);
        if (response.error) {
          throw new Error(response.message);
        }
        
        window.location.hash = '#/';
      } catch (error) {
        errorMessage.textContent = `Upload Gagal: ${error.message}`;
      }
    });
  }
}