export const registrationContainer = {
  'justify-content': 'center',
  'align-items': 'center',
  'margin': '10rem auto',
  'background': 'white',
  'padding': '20px 25px',
  'border': '5px solid #337ab7',
  'border-radius': '6px',
  'width': '550px',
  'height': 'auto',
  'box-sizing': 'border-box',
}

export const register = `
  <div class="registrationContainer centerContainer" id="registrationContainerDiv">
    <form name="registration">
      <div class="form-group" style="position: relative" id="name">
        <input
          type="text"
          class="form-control"
          placeholder="John"
          name="name"
          required
        >
        <div id="nameIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
      </div>

      <div class="form-group" style="position: relative" id="email">
        <input
          type="email"
          class="form-control"
          placeholder="john@example.com"
          name="email"
          required
        >
        <div id="emailIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
      </div>

      <div class="form-group" style="position: relative" id="password">
        <input
          type="password"
          class="form-control"
          placeholder="********"
          name="password"
          required
        >
        <div id="passwordIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
        <div id="passwordInfo" style="font-size: 12px; margin-top: 5px;">
          Your password needs at least 8 characters
        </div>
      </div>

      <div class="col-half">
        <h5>Gender</h5>
        <div class="gender-input-group">
          <input
            id="male"
            type="radio"
            name="gender"
            value="male"
          >
          <label for="male">Male</label>
          <input
            id="female"
            type="radio"
            name="gender"
            value="female"
          >
          <label for="female">Female</label>
        </div>
      </div>

      <div>
        <div>Date of Birth</div>
        <div class="form-group col-md-4" style="padding-left: 0">
          <select name="birthMonth" class="form-control" required>
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
          <select name="birthDate" class="form-control" required>
            <option>Day</option>
            day
          </select>
        </div>
        <div class="form-group col-md-4">
          <select name="birthYear" class="form-control" required>
            <option>Year</option>
            year
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 col-md-offset-4 text-center">
          <button onclick="handleSignUp(event)" class="btn btn-success" name="signUpButton">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
`;