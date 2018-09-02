import * as bootstrap from './styles/bootstrap.js';
import { layout } from './views/layout.js';
import { personalInfo } from '/javascripts/views/register/personalInfo.js';
import { welcomeHomePage } from './views/home.js';

const addBootstrap = () => {
  document.head.appendChild(bootstrap.bootstrapMinCss())
  document.head.appendChild(bootstrap.bootstrapThemeMinCss())
  document.head.appendChild(bootstrap.bootstrapJs())
  document.head.appendChild(bootstrap.jQueryCookie())
  document.head.appendChild(bootstrap.fontAwesome())
}

export default (() => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    document.getElementById('app').innerHTML = layout + welcomeHomePage();
  } else if (window.location.pathname === '/register') {
    addBootstrap()
    const css = document.createElement('link')
    css.rel = "stylesheet"
    css.href = "javascripts/styles/register/personalInfo.css"
    css.type = "text/css"
    document.head.appendChild(css)
    document.getElementById('app').innerHTML = layout + personalInfo;
  }
})