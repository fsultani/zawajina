window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    [
      '/javascripts/views/layout.js',
      '/javascripts/views/register/personal-info.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
      'https://unpkg.com/axios/dist/axios.min.js',
      '/stylesheets/style.css',
      '/stylesheets/registration.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
    ].forEach(function(type) {
      if (type.substring(type.length - 3) === '.js') {
        const script = document.createElement('script')
        script.src = type
        script.async = false
        document.head.appendChild(script)
      } else {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = type
        document.head.appendChild(link)
      }
    })
  } else if (window.location.pathname === '/register/about') {
    console.log("about")
    ['/javascripts/views/layout.js', '/javascripts/views/register/about-user.js'].forEach(function(src) {
      let script = document.createElement('script')
      script.src = src
      script.async = false
      document.head.appendChild(script)
    })
  }
})
