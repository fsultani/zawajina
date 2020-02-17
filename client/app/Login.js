const Login = () => {
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = "stylesheet";
  fontAwesome.href = "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

  const loginPageStyles = document.createElement('link');
  loginPageStyles.rel = "stylesheet"
  loginPageStyles.href = '/static/dist/landing-page/pages/login/css/styles.css';

  document.head.appendChild(fontAwesome);
  document.head.appendChild(loginPageStyles);

  const layout = `
    <div class="limiter">
      <div class="logo">
        <h1 class="margin-0">
          <a href="/"><img src="/static/client/landing-page/images/home.svg" alt="Feature 01"></a>
        </h1>
      </div>
      <div class="container-login100">
        <div class="wrap-login100">
          <div class="login100-pic js-tilt" data-tilt>
            <img src="/static/client/landing-page/images/login.png" alt="IMG">
          </div>

          <form class="login100-form validate-form" name="loginForm">
            <span class="login100-form-title">
              Login
            </span>

            <div class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
              <input class="input100" type="text" name="email" placeholder="Email">
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div class="wrap-input100 validate-input" data-validate = "Password is required">
              <input class="input100" type="password" name="password" placeholder="Password">
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
            <div class="container-login100-form-btn">
              <button class="login100-form-btn" onclick="handleLogin(event)">
                Login
              </button>
            </div>

            <div class="text-center p-t-12">
              <span class="txt1">
                Forgot
              </span>
              <a class="txt2" href="#">
                Username / Password?
              </a>
            </div>

            <div class="text-center p-t-136">
              <a class="txt2" href="/register">
                Create your Account
                <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.getElementById('app').innerHTML = layout;
}

export default Login;
