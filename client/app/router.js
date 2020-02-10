// const navBarCss = document.createElement('link')
// navBarCss.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'

axios.get("/api/user-details").then(res => {
  const { name } = res.data;
  const navBar = `
    <center>
      <h1>Welcome home, ${name}!</h1>
    </center>

    <header class="navbar--site-header">
      <div class="navbar--container">
        <div class="navbar--site-header-inner">
          <div>
            <a href="/"><img src="/static/client/images/home.svg" alt="Home"></a>
          </div>
          <ul class="navbar--header-links list-reset margin-0">
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a class="button navbar--button-sm navbar--button-shadow" href="/signup">Signup</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `;
  document.getElementById('app').innerHTML = navBar;
})
