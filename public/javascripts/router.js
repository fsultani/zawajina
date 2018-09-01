import * as bootstrap from './styles/bootstrap.js';

import { layout } from './views/layout.js';
import {
  personalInfo,
} from './views/register/personalInfo.js';
import { welcomeHomePage } from './views/home.js';

const addBootstrap = () => {
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapMinCss())
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapThemeMinCss())
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapJs())
}

const personalInfoCss = () => {
  const css = document.createElement('link')
  css.rel = "stylesheet"
  css.href="javascripts/styles/personalInfo.css"
  document.getElementsByTagName('head')[0].appendChild(css)
}

export const router = () => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    addBootstrap()
    const homePage = document.getElementById('app').innerHTML = layout + welcomeHomePage();
    return homePage
  } else if (window.location.pathname === '/register') {
    addBootstrap()
    personalInfoCss()
    const registerPage = document.getElementById('app').innerHTML = layout + personalInfo;
    return registerPage
  }
}
