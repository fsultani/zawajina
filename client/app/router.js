import NavBar from './components/NavBar/NavBar.js';
import Body from './Body.js';
import { Profile, About, Contact, Search } from './profile.js';

const checkAuthentication = async () => {
  try {
    const isAuthenticated = await axios.get("/api/authenticate", {
      headers: {
        Authorization: Cookies.get('token')
      }
    })
    return isAuthenticated.status;
  } catch (err) {
    return err.response;
  }
};

const Router = async path => {
  const checkAuthenticationStatus = await checkAuthentication();
  if (checkAuthenticationStatus === 201) {
    document.querySelector('#nav').innerHTML = NavBar();
    document.querySelector('#logout').onclick = () => {
      Cookies.remove('token');
      window.location.pathname = '/login';
    }
    if ((path === 'home') || (path === '/')) {
      Body();
    } else if (path === 'profile') {
      Profile();
    } else if (path === 'about') {
      About();
    } else if (path === 'contact') {
      Contact();
    } else if (path === 'search') {
      Search();
    } else {
      Body();
    }
  } else {
    Cookies.remove('token');
    window.location.assign('/login');
  }
}

(() => {
  const { pathname } = window.location;
  const path = pathname.length > 1 ? pathname.slice(1, pathname.length) : pathname;
  Router(path);
})();
