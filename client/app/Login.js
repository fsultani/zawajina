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
          <form class="login100-form validate-form">
            <span class="login100-form-title p-b-26">
              Login
            </span>

            <div class="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
              <input class="input100" type="text" name="email">
              <span class="focus-input100" data-placeholder="Email"></span>
            </div>

            <div class="wrap-input100 validate-input" data-validate="Enter password">
              <span class="btn-show-pass">
                <i class="zmdi zmdi-eye"></i>
              </span>
              <input class="input100" type="password" name="pass">
              <span class="focus-input100" data-placeholder="Password"></span>
            </div>

            <div class="container-login100-form-btn">
              <div class="wrap-login100-form-btn">
                <div class="login100-form-bgbtn"></div>
                <button class="login100-form-btn">
                  Login
                </button>
              </div>
            </div>

            <div class="text-center p-t-115">
              <span class="txt1">
                Don’t have an account?
              </span>

              <a class="txt2" href="#">
                Sign Up
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
