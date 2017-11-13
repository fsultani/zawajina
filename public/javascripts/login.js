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

function login() {
  const username = document.loginForm.username.value
  const password = document.loginForm.password.value
  var xhr = new XMLHttpRequest();

  xhr.open('POST', '/login', true)
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`username=${username}&password=${password}`)
  xhr.onload = function() {
    if (JSON.parse(this.responseText).token) {
      var token = JSON.parse(this.responseText).token
      Cookies.set('token', token)
      window.location.pathname = '/home'
    }
  }
}

const output = this.layout + loginPage;

window.addEventListener('load', () => {
  if (window.location.pathname === '/login') {
    document.getElementById('my-app').innerHTML = output;
  }
})
