import { layout } from './layout'
import { welcomeMessage } from './views/home'
import { loginPage } from './views/login'
import { PersonalInfo } from './views/personal-info'

const app = document.getElementById('app')

export default (() => {
  window.onload = (() => {
    window.location.hash = ''
    if (!window.location.hash) {
      app.innerHTML = layout() + welcomeMessage()
    }
    // const Router = function(name, routes) {
    //   return {
    //     name: name,
    //     routes: routes
    //   }
    // }

    // const FirstRouter = new Router('FirstRouter', [
    //   {
    //     path: '/#home' || '/#',
    //     name: 'Home'
    //   },
    //   {
    //     path: '/#login',
    //     name: 'Login'
    //   },
    //   {
    //     path: '/#register',
    //     name: 'Register'
    //   }
    // ])
    window.addEventListener("hashchange", () => {
      const CurrentPath = window.location.hash
      const urlPathname = CurrentPath.substr(1)
      if (!CurrentPath) {
        window.history.pushState({}, '', '/')
        app.innerHTML = layout() + welcomeMessage()
      } else if (CurrentPath === '#login') {
        window.history.pushState({}, '', urlPathname)
        app.innerHTML = layout() + loginPage()
      } else if (CurrentPath === '#register') {
        window.history.pushState({}, '', urlPathname)
        app.innerHTML = layout() + PersonalInfo()
      }
    })
  })
})
