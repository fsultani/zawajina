import { layout } from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import WelcomeHomePage from './views/home.js';
import loginPage from './views/login.js';

export default (() => {
  let { pathname, hash } = window.location;
  if (!hash || hash === '#home' || (pathname && hash)) {
    window.history.replaceState(null, null, '/login');
    // document.getElementById('app').innerHTML = layout + WelcomeHomePage();
    document.getElementById('app').innerHTML = layout + loginPage();

    document.getElementById("login").onclick = (e) => {
      e.preventDefault();
      const email = document.loginForm.email.value
      const password = document.loginForm.password.value
      console.log("email\n", email)
      console.log("password\n", password)
      axios.post('/login', {
        email,
        password
      }).then(res => {
        console.log("res.data\n", res.data)
        Cookies.set('token', res.data.token)
        Cookies.set('name', res.data.member.name)
        Cookies.set('id', res.data.member._id)
        // window.location.pathname = '/home'
      })
    }
  }

  window.addEventListener('popstate', (e) => {
    switch (window.location.pathname) {
      case '/':
        document.getElementById('app').innerHTML = layout + WelcomeHomePage();
        break;
      case '/login':
        document.getElementById('app').innerHTML = layout + loginPage;
        break;
      case '/register':
        document.getElementById('app').innerHTML = layout + personalInfo;
        break;
      default:
        break;
    }
  })

  window.addEventListener('hashchange', () => {
    switch (window.location.hash) {
      case '#home':
        window.history.replaceState(null, null, '/');
        document.getElementById('app').innerHTML = layout + WelcomeHomePage();
        break;
      case '#login':
        window.history.replaceState(null, null, '/login');
        document.getElementById('app').innerHTML = layout + loginPage;
        break;
      case '#register':
        window.history.replaceState(null, null, '/register');
        document.getElementById('app').innerHTML = layout + personalInfo;
        break;
      default:
        break;
    }
  })
})
