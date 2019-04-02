const loginPageCss = () => {
  let fontAwesomeCss;
  let animateCss;
  let hamburgersCss;
  let select2Css;
  let utilCss;
  let mainCss;

  const loginPageCssLinks = []
  const loginPageCssHrefs = [
    {
      href: "/static/css/fonts/font-awesome-4.7.0/css/font-awesome.min.css"
    },
    {
      href: "/static/css/animate.css"
    },
    {
      href: "/static/css/hamburgers.min.css"
    },
    {
      href: "/static/css/select2.min.css"
    },
    {
      href: "/static/css/util.css"
    },
    {
      href: "/static/css/login-main.css"
    }
  ]

  loginPageCssLinks.push(
    fontAwesomeCss,
    animateCss,
    hamburgersCss,
    select2Css,
    utilCss,
    mainCss
  )

  loginPageCssLinks.map((element, index) => {
    element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = loginPageCssHrefs[index].href
    document.head.appendChild(element)
  });

  const bootstrapCss = document.createElement('link')
  bootstrapCss.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
  bootstrapCss.integrity = "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
  bootstrapCss.crossOrigin = "anonymous"

  const popper = document.createElement('script')
  popper.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js'
  popper.integrity = "sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
  popper.crossOrigin = "anonymous"

  const jQuery = document.createElement('script')
  jQuery.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js'
  jQuery.integrity = "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
  jQuery.crossOrigin = "anonymous"

  const bootstrapJs = document.createElement('script')
  bootstrapJs.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
  bootstrapJs.integrity = "sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" 
  bootstrapJs.crossOrigin = "anonymous"

  document.head.appendChild(bootstrapCss)
  document.body.appendChild(jQuery)
  document.body.appendChild(popper)
  document.body.appendChild(bootstrapJs)
}

const Login = () => document.getElementById('app').innerHTML = `
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-pic js-tilt" data-tilt>
          <img src="/static/images/login.png" alt="IMG">
        </div>

        <form class="login100-form validate-form" name="loginForm">
          <span class="login100-form-title">
            Member Login
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
            <a class="txt2" href="#">
              Create your Account
              <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export { loginPageCss, Login};
