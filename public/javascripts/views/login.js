const loginPage = () => {
  return (
    `
      <div align="center">
        <h2 class="page-header">Account Login</h2>
        <form name="loginForm">
          <div class="form-group">
            <input type="text" class="form-control" name="email" placeholder="Email" style="width: 20%" required>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" name="password" placeholder="Password" style="width: 20%" required>
          </div>
        </form>
        <button type="button" onclick="handleLogin()" class="btn btn-success" id="login">Login</button>
      </div>
    `
  )
}

export default loginPage;