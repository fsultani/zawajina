import App from './index.js';

window.onload = () => {

  const logoutScript = document.createElement('script');
  logoutScript.src = '/static/client/app/components/NavBar/Logout.js';
  document.head.appendChild(logoutScript);

  App()
};
