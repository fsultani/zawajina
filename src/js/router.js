import { layout } from './layout'
import { welcomeMessage } from './views/home'
import { loginPage } from './views/login'
import { PersonalInfo } from './views/personal-info'

const app = document.getElementById('app')

export default (() => {
  window.onload = (() => {
    window.location.hash = ''
    window.history.pushState({ name: '/' }, '', '/')
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
      console.log("hashchange\n", window.history.state)
      const CurrentPath = window.location.hash
      const urlPathname = CurrentPath.substr(1)
      // console.log("CurrentPath\n", CurrentPath)
      // console.log("urlPathname\n", urlPathname)
      if (!CurrentPath) {
        window.history.pushState({}, '', '/')
        app.innerHTML = layout() + welcomeMessage()
      } else if (CurrentPath === '#login') {
        window.history.pushState({name: urlPathname}, '', urlPathname)
        app.innerHTML = layout() + loginPage()
      } else if (CurrentPath === '#register') {   
        window.history.pushState({name: urlPathname}, '', urlPathname)
        app.innerHTML = layout() + PersonalInfo()
      }
    })
    window.onpopstate = (() => {
      console.log("onpopstate\n", window.history.state)
    })
  })
})
