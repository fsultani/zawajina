import { loginPageCss, removeLoginPageCss, Login } from './pages/Login/index.js';
import { personalInfoCss, PersonalInfo } from './pages/Register/PersonalInfo/index.js';

const scrollreveal = document.createElement('script')
scrollreveal.src = "https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js"

const googleapis = document.createElement('link')
googleapis.rel = "stylesheet"
googleapis.href = "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700"

const axiosScript = document.createElement('script')
axiosScript.src = "https://unpkg.com/axios/dist/axios.min.js"

document.head.appendChild(googleapis)
document.head.appendChild(scrollreveal)
document.head.appendChild(axiosScript)

// if (window.location.pathname === '/') {
//   const element = document.createElement('link')
//   element.rel = "stylesheet"
//   element.href = "/static/css/Home/style.css"
//   document.head.appendChild(element)
// }

window.addEventListener('hashchange', event => {
  event.preventDefault();
  const { hash } = window.location;

  if (hash === '#home') {
    removeLoginPageCss();
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else if (hash === '#login') {
    loginPageCss();
  } else if (hash === '#register') {
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
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else if (page === 'login') {
    loginPageCss();
  } else if (page === 'register') {
    // window.history.replaceState({ page: 'register'}, null, '/register');
  }
})

// if (window.history.state && window.history.state.page) {
//   const { page } = window.history.state
//   if (page === 'login') {
//     loginPageCss();
//   }
// }

if (Cookies.get('token')) {
  if (!window.history.state) {
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  } else {
    if (window.history.state.page) {
      const { page } = window.history.state
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
      const element = document.createElement('link')
      element.rel = "stylesheet"
      element.href = "/static/css/Home/style.css"
      document.head.appendChild(element)
    } else if (page === 'login') {
      // loginPageCss();
    } else if (page === 'register') {
      // personalInfoCss();
    } else {
      const element = document.createElement('link')
      element.rel = "stylesheet"
      element.href = "/static/css/Home/style.css"
      document.head.appendChild(element)
    }
  } else {
    const element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = "/static/css/Home/style.css"
    document.head.appendChild(element)
  }
}