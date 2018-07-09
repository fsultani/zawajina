window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    const myApp = document.getElementsByTagName('head')[0]
    const bootStrapJs = document.createElement('script')
    const jQueryCookie = document.createElement('script')
    const layout = document.createElement('script')
    const personalInfo = document.createElement('script')
    const axios = document.createElement('script')

    const bootStrapMinCss = document.createElement('link')
    const bootStrapThemeCss = document.createElement('link')
    const styles = document.createElement('link')
    const registrationStyles = document.createElement('link')

    styles.type = 'text/css'
    styles.rel = 'stylesheet'
    styles.href = './stylesheets/style.css'

    registrationStyles.type = 'text/css'
    registrationStyles.rel = 'stylesheet'
    registrationStyles.href = './stylesheets/registration.css'

    bootStrapMinCss.type = 'text/css'
    bootStrapMinCss.rel = 'stylesheet'
    bootStrapMinCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'

    bootStrapThemeCss.type = 'text/css'
    bootStrapThemeCss.rel = 'stylesheet'
    bootStrapThemeCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'

    bootStrapJs.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'

    jQueryCookie.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js'

    layout.src = 'javascripts/views/layout.js'
    personalInfo.src = 'javascripts/views/register/personal-info.js'
    axios.src = 'https://unpkg.com/axios/dist/axios.min.js'

    myApp.appendChild(jQueryCookie)
    myApp.appendChild(bootStrapJs)
    myApp.appendChild(bootStrapMinCss)
    myApp.appendChild(styles)
    myApp.appendChild(registrationStyles)
    myApp.appendChild(bootStrapThemeCss)
    myApp.appendChild(layout)
    myApp.appendChild(personalInfo)
    myApp.appendChild(axios)
  } else if (window.location.pathname === '/register/about') {
    const myApp = document.getElementsByTagName('head')[0]
    const bootStrapJs = document.createElement('script')
    const jQueryCookie = document.createElement('script')
    const layout = document.createElement('script')
    const personalInfo = document.createElement('script')
    const aboutInfo = document.createElement('script')

    const bootStrapMinCss = document.createElement('link')
    const bootStrapThemeCss = document.createElement('link')
    const styles = document.createElement('link')
    const registrationStyles = document.createElement('link')

    styles.type = 'text/css'
    styles.rel = 'stylesheet'
    styles.href = './stylesheets/style.css'

    registrationStyles.type = 'text/css'
    registrationStyles.rel = 'stylesheet'
    registrationStyles.href = './stylesheets/registration.css'

    bootStrapMinCss.type = 'text/css'
    bootStrapMinCss.rel = 'stylesheet'
    bootStrapMinCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'

    bootStrapThemeCss.type = 'text/css'
    bootStrapThemeCss.rel = 'stylesheet'
    bootStrapThemeCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'

    bootStrapJs.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'

    jQueryCookie.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js'

    layout.src = 'javascripts/views/layout.js'
    personalInfo.src = 'javascripts/views/register/personal-info.js'
    aboutInfo.src = 'javascripts/views/register/about.js'

    myApp.appendChild(jQueryCookie)
    myApp.appendChild(bootStrapJs)
    myApp.appendChild(bootStrapMinCss)
    myApp.appendChild(styles)
    myApp.appendChild(registrationStyles)
    myApp.appendChild(bootStrapThemeCss)
    myApp.appendChild(layout)
    myApp.appendChild(personalInfo)
    myApp.appendChild(aboutInfo)
  }
})
