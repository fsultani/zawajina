import { layout } from './views/layout.js';
import { register } from './views/register/1-personal.js';
import { bootstrapMinCss, bootstrapThemeMinCss, bootstrapJs } from './styles/bootstrap.js';

window.onload = () => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    document.getElementsByTagName('head')[0].appendChild(bootstrapMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrapThemeMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrapJs())
    document.getElementById('my-app').innerHTML = layout;
  } else if (window.location.pathname === '/register') {
    document.getElementsByTagName('head')[0].appendChild(bootstrapMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrapThemeMinCss())
    document.getElementsByTagName('head')[0].appendChild(bootstrapJs())
    document.getElementById('my-app').innerHTML = register;
  }
}