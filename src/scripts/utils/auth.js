const Auth = {
  storeToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },
  
  storeUser(name) {
    localStorage.setItem('user', name);
  },
  
  getUser() {
    return localStorage.getItem('user');
  }
};

export default Auth;