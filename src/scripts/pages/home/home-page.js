import L from 'leaflet';
import StoryApi from '../../data/api';
import FavoriteStoryIdb from '../../data/favorite-story-idb';
import { showFormattedDate } from '../../utils/index';

const HomePage = {
  async render() {
    return `
      <section class="container home-container">
        <h1>Peta Cerita</h1>
        <div id="map"></div>
        
        <h2 class="story-list-title">Semua Cerita</h2> 
        
        <div id="story-list-container">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    document.title = 'Home - Story App';
    
    try {
      const response = await StoryApi.getAllStories();
      if (response.error) {
        throw new Error(response.message);
      }
      
      const stories = response.listStory;
      
      this._initMap(stories);
      this._renderStoryList(stories);
    } catch (error) {
      const container = document.querySelector('#story-list-container');
      if (container) {
        container.innerHTML = `<p class="error-message">Gagal memuat data: ${error.message}</p>`;
      }
    }
  },

  _initMap(stories) {
    const defaultCoords = [-2.5489, 118.0149];
    const map = L.map('map').setView(defaultCoords, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`
            <b>${story.name}</b><br>
            ${story.description.substring(0, 50)}...
          `);
      }
    });
  },

  _renderStoryList(stories) {
    const container = document.querySelector('#story-list-container');
    container.innerHTML = '';

    if (stories.length === 0) {
      container.innerHTML = '<p>Belum ada cerita untuk ditampilkan.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyItem = document.createElement('article');
      storyItem.classList.add('story-item');
      
      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}" class="story-item__image">
        <div class="story-item__content">
          <h3 class="story-item__name">${story.name}</h3>
          <p class="story-item__date">${showFormattedDate(story.createdAt)}</p>
          <p class="story-item__description">${story.description}</p>
          <button class="btn-favorite" style="margin-top: 10px; padding: 8px 16px; background-color: #d84315; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ❤️ Simpan ke Favorit
          </button>
        </div>
      `;

      const saveBtn = storyItem.querySelector('.btn-favorite');
      saveBtn.addEventListener('click', async () => {
        await FavoriteStoryIdb.putStory(story);
        alert('Cerita berhasil disimpan ke halaman Favorit!');
      });

      container.appendChild(storyItem);
    });
  },
};

export default HomePage;