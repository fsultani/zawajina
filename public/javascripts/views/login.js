loginPage = `
  <div align="center">
    <h2 class="page-header">Account Login</h2>
    <form name="loginForm">
    <form>
      <div class="form-group">
        <input type="text" class="form-control" name="username" placeholder="Username" style="width: 20%" required>
      </div>
      <div class="form-group">
        <input type="password" class="form-control" name="password" placeholder="Password" style="width: 20%" required>
      </div>
      <input type="button" class="btn btn-success" onclick="login()" value="Submit" />
    </form>
  </div>
`

const output = layout + loginPage;

window.addEventListener('load', () => {
  if (window.location.pathname === '/login') {
    document.getElementById('my-app').innerHTML = output;
  }
})
