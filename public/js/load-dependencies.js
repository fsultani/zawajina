import { loginPageCss } from './pages/Login/index.js';

const scrollreveal = document.createElement('script')
scrollreveal.src = "https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js"
document.head.appendChild(scrollreveal)

const googleapis = document.createElement('link')
googleapis.rel = "stylesheet"
googleapis.href = "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700"
document.head.appendChild(googleapis)

const jsCookie = document.createElement('script')
jsCookie.src = "/static/js/styles/js.cookie.js"
document.head.appendChild(jsCookie)

const axiosScript = document.createElement('script')
axiosScript.src = "https://unpkg.com/axios/dist/axios.min.js"
document.head.appendChild(axiosScript)

if (window.location.pathname === '/') {
  const element = document.createElement('link')
  element.rel = "stylesheet"
  element.href = "/static/css/Home/style.css"
  document.head.appendChild(element)
}

window.addEventListener('hashchange', event => {
  event.preventDefault();
  const { hash } = window.location;
  if (hash === '#login') {
    console.log("hashchange load-dependencies login")
    loginPageCss();
  }
})

if (window.history.state && window.history.state.page) {
  const { page } = window.history.state
  if (page === 'login') {
    console.log("initial load load-dependencies login")
    loginPageCss();
  }
}