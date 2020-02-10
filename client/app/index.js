import NavBar from '/static/client/app/components/NavBar/index.js';
import Body from './Body.js';

const App = () => {
  const globalStyles = document.createElement('link');
  globalStyles.rel = "stylesheet"
  globalStyles.href = '/static/client/app/global-styles.css';

  document.head.appendChild(globalStyles);

  const appLayout = `
    <div id="navbar"></div>
    <div id="main-app"></div>
  `;
  document.getElementById('app').innerHTML = appLayout;
  NavBar();
  Body();
}

export default App;
