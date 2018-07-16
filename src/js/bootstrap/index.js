const bootstrapFiles = () => {
  const bootstrapCss = document.createElement('link')
  bootstrapCss.rel = 'stylesheet'
  bootstrapCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'

  const bootstrapThemeCss = document.createElement('link')
  bootstrapThemeCss.rel = 'stylesheet'
  bootstrapThemeCss.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'

  const bootstrapJs = document.createElement('script')
  bootstrapJs.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'

  document.head.appendChild(bootstrapCss)
  document.head.appendChild(bootstrapThemeCss)
  document.head.appendChild(bootstrapJs)
}

export { bootstrapFiles }