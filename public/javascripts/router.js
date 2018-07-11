window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    console.log("I'm in the register page")
    document.getElementById('my-app').innerHTML = `
        <p>This is the register page</p>
        <a href="/register/about">About page</a>
    `
  } else if (window.location.pathname === '/register/about') {
    document.getElementById('my-app').innerHTML = `
        <p>This is the about page</p>
        <a href="/register">Go to register page</a>
    `
  }
})
