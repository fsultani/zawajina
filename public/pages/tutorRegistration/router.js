import Home from '/static/pages/tutorRegistration/index.js';

// import { personalInfoCss, PersonalInfo } from './pages/Register/PersonalInfo/index.js';
// import welcome from './pages/welcome.js';
// import { removeNonLoginCss, loginPageCss, Login } from './pages/Login/index.js';
// import memberProfile from './pages/memberProfile.js';

window.onload = () => {
  let { pathname } = window.location;

  if (Cookies.get('token')) {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home'}, null, '/');
      Home();
    } else {
      if (window.history.state.page) {
        const { page } = window.history.state
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      }
    }
  } else {
    // First page load
    if (window.history.state && window.history.state.page) {
      const { page } = window.history.state
      if (page === 'home') {
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      } else if (page === 'login') {
        window.history.replaceState({ page: 'login'}, null, '/login');
        Login();
      } else if (page === 'register') {
        window.history.replaceState({ page: 'register'}, null, '/register');
        PersonalInfo();
      } else {
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      }
    } else {
      window.history.replaceState({ page: 'home'}, null, '/home');
      Home();
    }
  }

  // window.addEventListener('popstate', event => {
  //   if (!event.state) {
  //     event.preventDefault()
  //     return false;
  //   }
  //   const { page } = event.state
  //   if (page === 'home') {
  //     window.history.replaceState({ page: 'home'}, null, '/');
  //     Home();
  //   } else if (page === 'login') {
  //     window.history.replaceState({ page: 'login'}, null, '/login');
  //     Login();
  //   } else if (page === 'register') {
  //     window.history.replaceState({ page: 'register'}, null, '/register');
  //   }
  // })

  // window.addEventListener('hashchange', event => {
  //   event.preventDefault();
  //   const { hash } = window.location;
  //   if (hash === '#home') {
  //     window.history.replaceState({ page: 'home'}, null, '/');
  //     Home();
  //   } else if (hash === '#login') {
  //     window.history.replaceState({ page: 'login'}, null, '/login');
  //     Login();
  //   } else if (hash === '#register') {
  //     window.history.replaceState({ page: 'register'}, null, '/register');
  //     PersonalInfo();
  //   }
  // })
}
