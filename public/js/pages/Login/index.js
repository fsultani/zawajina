const loginPageCss = () => {
  let fontAwesomeCss;
  let animateCss;
  let hamburgersCss;
  let utilCss;
  let mainCss;

  const loginPageCssLinks = []
  const loginPageCssHrefs = [
    {
      href: "/static/css/login-page/fonts/font-awesome-4.7.0/css/font-awesome.min.css"
    },
    {
      href: "/static/css/login-page/animate.css"
    },
    {
      href: "/static/css/login-page/hamburgers.min.css"
    },
    {
      href: "/static/css/login-page/util.css"
    },
    {
      href: "/static/css/login-page/main.css"
    }
  ]

  loginPageCssLinks.push(
    fontAwesomeCss,
    animateCss,
    hamburgersCss,
    utilCss,
    mainCss
  )

  loginPageCssLinks.map((element, index) => {
    element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = loginPageCssHrefs[index].href
    element.setAttribute('id', `loginPageCssLinks-${index}`)
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

const removeLoginPageCss = () => {
  const list = document.getElementsByTagName('link')

  Object.entries(list).map(item => {
    if (item[1].href.split('/').includes('login-page')) {
      item[1].parentNode.removeChild(item[1])
    }
  })

  // document.getElementById('loginPageCssLinks-0').parentNode.removeChild(document.getElementById('loginPageCssLinks-0'))
  // document.getElementById('loginPageCssLinks-1').parentNode.removeChild(document.getElementById('loginPageCssLinks-1'))
  // document.getElementById('loginPageCssLinks-2').parentNode.removeChild(document.getElementById('loginPageCssLinks-2'))
  // document.getElementById('loginPageCssLinks-3').parentNode.removeChild(document.getElementById('loginPageCssLinks-3'))
  // document.getElementById('loginPageCssLinks-4').parentNode.removeChild(document.getElementById('loginPageCssLinks-4'))
}

const Login = () => document.getElementById('app').innerHTML = `
  <div class="limiter">
    <div class="logo">
      <h1 class="m-0">
        <a href="#home">
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient x1="114.674%" y1="39.507%" x2="-52.998%" y2="39.507%" id="logo-a">
                <stop stop-color="#ffffff" offset="0%"/>
                <stop stop-color="#ffffff" stop-opacity="0" offset="100%"/>
              </linearGradient>
              <linearGradient x1="93.05%" y1="19.767%" x2="15.034%" y2="85.765%" id="logo-b">
                <stop stop-color="#FF3058" offset="0%"/>
                <stop stop-color="#FF6381" offset="100%"/>
              </linearGradient>
              <linearGradient x1="32.716%" y1="-20.176%" x2="32.716%" y2="148.747%" id="logo-c">
                <stop stop-color="#FF97AA" offset="0%"/>
                <stop stop-color="#FF97AA" stop-opacity="0" offset="100%"/>
              </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
              <path d="M31.12 7.482C28.327 19.146 19.147 28.326 7.483 31.121A12.04 12.04 0 0 1 .88 24.518C3.674 12.854 12.854 3.674 24.518.879a12.04 12.04 0 0 1 6.603 6.603z" fill="#ffffff"/>
              <path d="M28.874 3.922l-24.91 24.99a12.026 12.026 0 0 1-3.085-4.394C3.674 12.854 12.854 3.674 24.518.879a12.025 12.025 0 0 1 4.356 3.043z" fill="url(#logo-a)"/>
              <g opacity=".88">
                <path d="M31.12 24.518a12.04 12.04 0 0 1-6.602 6.603C12.854 28.326 3.674 19.146.879 7.482A12.04 12.04 0 0 1 7.482.88c11.664 2.795 20.844 11.975 23.639 23.639z" fill="url(#logo-b)"/>
                <path d="M24.518 31.12C12.854 28.327 3.674 19.147.879 7.483A12.015 12.015 0 0 1 3.46 3.57L28.47 28.5a12.016 12.016 0 0 1-3.951 2.62z" fill="url(#logo-c)"/>
              </g>
            </g>
          </svg>
        </a>
      </h1>
    </div>
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

export { loginPageCss, removeLoginPageCss, Login};
