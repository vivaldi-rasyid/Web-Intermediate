import FavoriteStoryIdb from '../../data/favorite-story-idb';
import { showFormattedDate } from '../../utils/index';

const FavoritePage = {
  async render() {
    return `
      <section class="container">
        <h1 class="story-list-title">Cerita Favorit Saya</h1>
        <div id="favorite-list" class="story-list">
          <p>Memuat favorit...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    await this._renderStories();
  },

  async _renderStories() {
    try {
      const stories = await FavoriteStoryIdb.getAllStories();
      const container = document.querySelector('#favorite-list');

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="error-message">Belum ada cerita favorit.</p>';
        return;
      }

      container.innerHTML = '';
      stories.forEach((story) => {
        const storyItem = document.createElement('article');
        storyItem.classList.add('story-item');
        storyItem.innerHTML = `
            <img src="${story.photoUrl}" alt="${story.name}" class="story-item__image">
            <div class="story-item__content">
              <h3 class="story-item__name">${story.name}</h3>
              <p class="story-item__date">${showFormattedDate(story.createdAt)}</p>
              <p class="story-item__description">${story.description}</p>
              
              <button class="btn-delete-favorite" data-id="${story.id}" 
                style="background-color: #d32f2f; color: white; border: none; padding: 8px 16px; margin-top: 10px; cursor: pointer; border-radius: 4px;">
                Hapus dari Favorit
              </button>
            </div>
        `;
        
        const deleteBtn = storyItem.querySelector('.btn-delete-favorite');
        deleteBtn.addEventListener('click', async (e) => {
           const id = e.target.getAttribute('data-id');
           await FavoriteStoryIdb.deleteStory(id);
           alert('Berhasil dihapus dari favorit');
           await this._renderStories(); 
        });

        container.appendChild(storyItem);
      });
    } catch (error) {
      console.error(error);
      const container = document.querySelector('#favorite-list');
      if (container) container.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
  }
};

export default FavoritePage;