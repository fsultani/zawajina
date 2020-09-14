const Search = () => {
  const navBarStyles = document.createElement("link");
  navBarStyles.rel = "stylesheet";
  navBarStyles.type = "text/css";
  navBarStyles.href = "/static/client/app/components/NavBar/nav-bar-styles.css";

  const appGlobalStyles = document.createElement("link");
  appGlobalStyles.rel = "stylesheet";
  appGlobalStyles.type = "text/css";
  appGlobalStyles.href = "/static/client/app/app-global-styles.css";

  document.head.appendChild(appGlobalStyles);
  document.head.appendChild(navBarStyles);

  document.querySelector("#app").innerHTML = `<h1 style="text-align: center">Search page</h1>`;
};

export default Search;
