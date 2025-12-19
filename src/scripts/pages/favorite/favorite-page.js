import FavoriteStoryIdb from '../../data/favorite-story-idb';
import { showFormattedDate } from '../../utils/index';

class FavoritePage {
  async render() {
    return `
      <section class="container">
        <h2 class="story-list-title">Cerita Favorit Saya</h2>
        <div id="favorite-list" class="story-list">
          <p>Memuat favorit...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      const stories = await FavoriteStoryIdb.getAllStories();
      const container = document.querySelector('#favorite-list');

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="error-message">Belum ada cerita favorit.</p>';
        return;
      }

      container.innerHTML = '';
      stories.forEach((story) => {
        container.innerHTML += `
          <article class="story-item">
            <img src="${story.photoUrl}" alt="${story.name}" class="story-item__image">
            <div class="story-item__content">
              <h3 class="story-item__name">${story.name}</h3>
              <p class="story-item__description">${story.description}</p>
            </div>
          </article>
        `;
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default FavoritePage;