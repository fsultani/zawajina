register = `
  <form method="post" action="/register">
    <div class="row">
      <div class="form-group col-md-4 col-md-offset-2">
        <input type="text" class="form-control" placeholder="First Name" name="first_name">
      </div>
      <div class="form-group col-md-4">
        <input type="text" class="form-control" placeholder="Last Name" name="last_name">
      </div>
    </div>

    <div class="row">
      <div class="form-group col-md-4 col-md-offset-2">
        <input type="text" class="form-control" placeholder="Username" name="username">
      </div>
       <div class="form-group col-md-4">
        <input type="email" class="form-control" placeholder="Email" name="email">
      </div>
    </div>

    <div class="row">
      <div class="form-group col-md-4 col-md-offset-2">
        <input type="password" class="form-control" placeholder="Password" name="password">
      </div>
      <div class="form-group col-md-4">
        <input type="password" class="form-control" placeholder="Confirm Password" name="confirm_password">
      </div>
    </div>

    <div class="row">
      <div class="form-group col-md-4 col-md-offset-4">
        <center>
          <div>
            <label for="male">Male</label>
            <input id="male" type="radio" name="gender" value="male">
          </div>

          <div>
            <label for="female">Female</label>
            <input id="female" type="radio" name="gender" value="female">
          </div>
        </center>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 col-md-offset-4 text-center">
        <button type="submit" class="btn btn-success">Sign Up</button>
      </div>
    </div>
  </form>
`
const registrationPage = this.layout + register;

window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    document.getElementById('my-app').innerHTML = registrationPage;
  }
})
