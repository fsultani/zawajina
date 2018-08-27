import * as bootstrap from './styles/bootstrap.js';

import { layout } from './views/layout.js';
import { registrationContainer, register } from './views/register/1-personal.js';
import { welcomeHomePage } from './views/home.js';

const addBootstrap = () => {
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapMinCss())
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapThemeMinCss())
  document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapJs())
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
    const registerPage = document.getElementById('app').innerHTML = layout + register;
    Object.assign(document.getElementById('registrationContainerDiv').style, registrationContainer)
    return registerPage
  }
}
