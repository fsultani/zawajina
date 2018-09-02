export const bootstrapMinCss = () => {
  const bootstrapMinCssTag = document.createElement('link')
  bootstrapMinCssTag.rel = 'stylesheet'
  bootstrapMinCssTag.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
  return bootstrapMinCssTag
}

export const bootstrapThemeMinCss = () => {
  const bootstrapThemeMinCssTag = document.createElement('link')
  bootstrapThemeMinCssTag.rel = 'stylesheet'
  bootstrapThemeMinCssTag.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'
  return bootstrapThemeMinCssTag
}


export const bootstrapJs = () => {
  const bootstrapJsTag = document.createElement('script')
  bootstrapJsTag.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
  return bootstrapJsTag
}