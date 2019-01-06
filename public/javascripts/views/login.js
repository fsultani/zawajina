export default (() => `
    <div align="center">
      <h2 class="page-header">Account Login</h2>
      <form name="loginForm">
      <form>
        <div class="form-group">
          <input type="text" class="form-control" name="email" placeholder="Email" style="width: 20%" required>
        </div>
        <div class="form-group">
          <input type="password" class="form-control" name="password" placeholder="Password" style="width: 20%" required>
        </div>
        <button class="btn btn-success" id="login">Login</button>
      </form>
    </div>
  `
)
