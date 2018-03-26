const day = () => {
  const dayOptions = []
  const res = [...Array(32)].map((_, i) => dayOptions.push(`<option>${i+1}</option>`))
  return dayOptions
}

const year = () => {
  let yearOptions = []
  const res = [...Array(61)].map((_, i) => yearOptions.push(`<option>${1940+i}</option>`))
  return yearOptions.reverse()
}

register = `
  <div class="registrationContainer centerContainer">
    <form method="post" action="/register">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="First Name" name="first_name">
      </div>

       <div class="form-group">
        <input type="email" class="form-control" placeholder="Email" name="email">
      </div>

      <div class="form-group">
        <input type="password" class="form-control" placeholder="Password" name="password">
      </div>

      <div style="display: flex">
        <div style="width: 25%">
          I'm a
        </div>
        <div class="form-group" style="width: 50%">
          <center>
            <div class="gender-male">
              <label for="male">Male</label>
              <input id="male" type="radio" name="gender" value="male">
            </div>

            <div class="gender-female">
              <label for="female">Female</label>
              <input id="female" type="radio" name="gender" value="female">
            </div>
          </center>
        </div>
      </div>

      <div>
        <div>Date of Birth</div>
        <div class="form-group col-md-4" style="padding-left: 0">
          <select id="selectMonth" class="form-control">
            <option>Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <select id="selectDay" class="form-control">
            <option>Day</option>
            ${day()}
          </select>
        </div>
        <div class="form-group col-md-4">
          <select id="selectYear" class="form-control">
            <option>Year</option>
            ${year()}
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 col-md-offset-4 text-center">
          <button type="submit" class="btn btn-success">Sign Up</button>
        </div>
      </div>
    </form>
  </div>
`;

const registrationPage = layout + register

window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    document.getElementById('my-app').innerHTML = registrationPage;
  }
})
