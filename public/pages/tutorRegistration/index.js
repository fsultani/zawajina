const Home = () => document.getElementById('app').innerHTML = `
  <div class="main">
    <!-- <div w3-include-html="/static/pages/nav.html"></div> -->
    <section class="signup">
      <!-- <img src="/static/images/signup-bg.jpg" alt=""> -->
      <div class="container">
        <div class="signup-content">
          <div class="alert alert-danger" id="show-alert-danger">
            Email has already been taken
          </div>
          <form name="signupForm" onsubmit="return false" novalidate>
            <h2 class="form-title">Create a free tutor account</h2>
            <div class="form-group">
              <input type="text" class="form-input" name="first_name" id="first_name_id" placeholder="First Name" required />
            </div>
            <div class="form-group">
              <input type="text" class="form-input" name="last_name" id="last_name_id" placeholder="Last Name" required />
            </div>
            <div class="form-group">
              <input type="email" class="form-input" name="email" id="email_id" placeholder="Your Email" required />
            </div>
            <div class="form-group">

              <div class="password-container">
                <input type="password" class="form-input" name="password" id="password_id" placeholder="Password" required />
                <span id="passwordEye" toggle="#password" class="zmdi zmdi-eye-off field-icon toggle-password" onclick="togglePassword()"></span>
              </div>
              <div class="invalid-password">
                Your password needs at least 8 characters
              </div>
            </div>
            <div class="form-group">
              <button
                type="submit"
                onclick="handleSignup()"
                class="form-submit signup-button"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p class="loginhere">
            Have already an account ? <a href="/login" class="loginhere-link">Login here</a>
          </p>
        </div>
      </div>
    </section>
  </div>
`;

export default Home;
