import App from './index.js';
import Login from './Login.js';

window.onload = () => {
  // App();
  console.log("window.history.state\n", window.history.state);
  console.log("window.location\n", window.location.pathname);

  if (window.location.pathname === '/login') {
    Login();
  }
  // if (Cookies.get('token')) {
  //   if (!window.history.state) {
  //     window.history.replaceState({ page: 'home'}, null, '/');
  //     layout() + welcome();
  //   } else {
  //     if (window.history.state.page) {
  //       const { page } = window.history.state
  //       if (page.startsWith('userId')) {
  //         const memberId = window.location.pathname.split('/')[2]
  //         window.history.replaceState({ page: `userId=${memberId}`}, null, window.location.pathname);
  //         layout() + memberProfile(memberId);
  //       } else {
  //         window.history.replaceState({ page: 'home'}, null, '/');
  //         layout() + welcome();
  //       }
  //     }
  //   }
  // } else {
  //   if (window.history.state && window.history.state.page) {
  //     const { page } = window.history.state
  //     if (page === 'home') {
  //       window.history.replaceState({ page: 'home'}, null, '/');
  //       layout() + welcome();
  //     } else if (page === 'login') {
  //       window.history.replaceState({ page: 'login'}, null, '/login');
  //       document.getElementById('app').innerHTML = layout() + login();
  //     } else if (page === 'register') {
  //       window.history.replaceState({ page: 'register'}, null, '/register');
  //       document.getElementById('app').innerHTML = layout() + personalInfo;
  //     } else {
  //       window.history.replaceState({ page: 'home'}, null, '/');
  //     }
  //   } else {
  //     window.history.replaceState({ page: 'home'}, null, '/home');
  //     document.getElementById('app').innerHTML = layout() + login();
  //   }
  // }

  window.addEventListener('popstate', event => {
    // if (!event.state) {
    //   event.preventDefault()
    //   return false;
    // }
    // const { page } = event.state
    // if (page === 'home') {
    //   window.history.replaceState({ page: 'home'}, null, '/');
    //   layout() + welcome();
    // } else if (page === 'login') {
    //   window.history.replaceState({ page: 'login'}, null, '/login');
    //   document.getElementById('app').innerHTML = layout() + login();
    // } else if (page === 'register') {
    //   window.history.replaceState({ page: 'register'}, null, '/register');
    //   document.getElementById('app').innerHTML = layout() + personalInfo;
    // } else if (page.startsWith('userId')) {
    //   const memberId = window.location.pathname.split('/').slice(1)[1]
    //   window.history.replaceState({ page: `userId=${memberId}`}, null, window.location.pathname);
    //   layout() + memberProfile(memberId);
    // }
  })

  window.addEventListener('hashchange', event => {
  //   event.preventDefault();
  //   const { hash } = window.location;
  //   if (hash === '#home') {
  //     window.history.replaceState({ page: 'home'}, null, '/');
  //     layout() + welcome();
  //   } else if (hash === '#login') {
  //     window.history.replaceState({ page: 'login'}, null, '/login');
  //     document.getElementById('app').innerHTML = layout() + login();
  //   } else if (hash === '#register') {
  //     window.history.replaceState({ page: 'register'}, null, '/register');
  //     document.getElementById('app').innerHTML = layout() + personalInfo;
  //   } else if (hash.startsWith('#users')) {
  //     const memberId = window.location.hash.split('/')[1]
  //     window.history.replaceState({ page: `userId=${memberId}`}, null, hash.slice(1));
  //     layout() + memberProfile(memberId);
  //   }
  })
}
