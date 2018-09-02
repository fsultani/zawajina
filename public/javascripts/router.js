import * as bootstrap from './styles/bootstrap.js';

// import * as bootstrapMinCss from './styles/register/bootstrap.min.css'
// import * as bootstrapThemeMinCss from './styles/register/bootstrap-theme.min.css'
// import * as bootstrapJs from './styles/register/bootstrap-theme.min.css'

// import * as bootstrapJs from './styles/bootstrap.min.js'

import { layout } from './views/layout.js';
import PersonalInfo from '/javascripts/views/register/personalInfo.js';
import { welcomeHomePage } from './views/home.js';

const addBootstrap = () => {
  document.head.appendChild(bootstrap.bootstrapMinCss())
  document.head.appendChild(bootstrap.bootstrapThemeMinCss())
  document.head.appendChild(bootstrap.bootstrapJs())

  // const bootstrapJsScript = document.createElement('script')
  // bootstrapJsScript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
  // bootstrapJsScript.integrity = 'sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy'
  // bootstrapJsScript.crossorigin = 'anonymous'
  // document.getElementsByTagName('head')[0].appendChild(bootstrapJsScript)
}

const personalInfoCss = () => {
  // const css = document.createElement('link')
  // css.rel = "stylesheet"
  // css.href="javascripts/styles/register/personalInfo.css"
  // document.getElementsByTagName('head')[0].appendChild(css)
}

export default (() => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    // addBootstrap()
    const homePage = document.getElementById('app').innerHTML = layout + welcomeHomePage();
    return homePage
  } else if (window.location.pathname === '/register') {
    // const css = document.createElement('link')
    // css.rel = "stylesheet"
    // css.href = "javascripts/styles/register/personalInfo.css"
    // css.type = "text/css"
    // document.head.appendChild(css)
    addBootstrap()
    
    document.getElementById('app').innerHTML = layout + PersonalInfo;
    // return registerPage
  }
})