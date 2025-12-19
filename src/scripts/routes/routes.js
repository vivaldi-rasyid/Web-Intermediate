import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
// 1. IMPORT FavoritePage
import FavoritePage from '../pages/favorite/favorite-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  // 2. DAFTARKAN ROUTE FAVORITE DENGAN 'new'
  '/favorite': new FavoritePage(),
};

export default routes;