import { removeNonLoginCss, loginPageCss, Login } from './pages/Login/index.js';
import { removeNonRegisterCss, personalInfoCss, PersonalInfo } from './pages/Register/PersonalInfo/index.js';

const scrollreveal = document.createElement('script');
scrollreveal.src = "https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js";

const googleapis = document.createElement('link');
googleapis.rel = "stylesheet";
googleapis.href = "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700";

const axiosScript = document.createElement('script');
axiosScript.src = "https://unpkg.com/axios/dist/axios.min.js";

document.head.appendChild(googleapis);
document.head.appendChild(scrollreveal);
document.head.appendChild(axiosScript);

const homeRemoveOtherCss = () => {
  const list = document.getElementsByTagName('link')

  Object.entries(list).map(item => {
    if (!item[1].href.split('/').includes('Home')) {
      item[1].parentNode.removeChild(item[1])
    }
  })
}

window.addEventListener('hashchange', event => {
  event.preventDefault();
  const { hash } = window.location;

  if (hash === '#home') {
    homeRemoveOtherCss();
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else if (hash === '#login') {
    removeNonLoginCss();
    loginPageCss();
  } else if (hash === '#register') {
    removeNonRegisterCss();
    personalInfoCss();
  }
})

window.addEventListener('popstate', event => {
  if (!event.state) {
    event.preventDefault()
    return false;
  }
  const { page } = event.state
  if (page === 'home') {
    homeRemoveOtherCss();
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else if (page === 'login') {
    loginPageCss();
  } else if (page === 'register') {
    personalInfoCss();
  }
})

if (Cookies.get('token')) {
  if (!window.history.state) {
    homeRemoveOtherCss();
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else {
    if (window.history.state.page) {
      const { page } = window.history.state
      homeRemoveOtherCss();
      const element = document.createElement('link')
      element.rel = "stylesheet"
      element.href = "/static/css/Home/style.css"
      document.head.appendChild(element)
    }
  }
} else {
  // First page load
  if (window.history.state && window.history.state.page) {
    const { page } = window.history.state
    if (page === 'home') {
      homeRemoveOtherCss();
      const element = document.createElement('link')
      element.rel = "stylesheet"
      element.href = "/static/css/Home/style.css"
      document.head.appendChild(element)
    } else if (page === 'login') {
      loginPageCss();
    } else if (page === 'register') {
      personalInfoCss();
    } else {
      homeRemoveOtherCss();
      const element = document.createElement('link')
      element.rel = "stylesheet"
      element.href = "/static/css/Home/style.css"
      document.head.appendChild(element)
    }
  } else {
    homeRemoveOtherCss();
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  }
}
