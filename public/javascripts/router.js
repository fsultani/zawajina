import { layout } from './views/layout.js';
import { register } from './views/register/1-personal.js';
// document.getElementById('my-app').innerHTML = layout;

window.addEventListener('load', () => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    document.getElementById('my-app').innerHTML = layout;
  } else if (window.location.pathname === '/register') {
    console.log("register selected")
    document.getElementById('my-app').innerHTML = register;
  }
})
