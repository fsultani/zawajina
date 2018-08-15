import { layout } from './views/layout.js';
import { register } from './views/register/1-personal.js';
import * as bootstrap from './styles/bootstrap.js';

window.onload = () => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapThemeMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapJs())
    document.getElementById('my-app').innerHTML = layout;
  } else if (window.location.pathname === '/register') {
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapThemeMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrap.bootstrapJs())
    document.getElementById('my-app').innerHTML = register;
  }
}