import CONFIG from '../config';
import Auth from '../utils/auth';

const API_ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}register`,
  LOGIN: `${CONFIG.BASE_URL}login`,
  GET_STORIES: `${CONFIG.BASE_URL}stories`,
  ADD_STORY: `${CONFIG.BASE_URL}stories`,
};

class StoryApi {
  static async register({ name, email, password }) {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  }

  static async login({ email, password }) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  static async getAllStories() {
    const token = Auth.getToken(); 
    const response = await fetch(`${API_ENDPOINTS.GET_STORIES}?location=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  static async addNewStory(formData) {
    const token = Auth.getToken();
    const response = await fetch(API_ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  }

  static async subscribePush(subscription) {
    const token = Auth.getToken();
    const response = await fetch(`${CONFIG.BASE_URL}notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  }
}

export default StoryApi;