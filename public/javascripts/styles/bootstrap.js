export const bootstrapMinCss = () => {
  const bootstrapMinCssTag = document.createElement('link')
  bootstrapMinCssTag.rel = 'stylesheet'
  bootstrapMinCssTag.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
  bootstrapMinCssTag.integrity = 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u'
  bootstrapMinCssTag.crossOrigin = 'anonymous'
  return bootstrapMinCssTag
}

export const bootstrapThemeMinCss = () => {
  const bootstrapThemeMinCssTag = document.createElement('link')
  bootstrapThemeMinCssTag.rel = 'stylesheet'
  bootstrapThemeMinCssTag.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'
  bootstrapThemeMinCssTag.integrity = 'sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp'
  bootstrapThemeMinCssTag.crossOrigin = 'anonymous'
  return bootstrapThemeMinCssTag
}


export const bootstrapJs = () => {
  const bootstrapJsTag = document.createElement('script')
  bootstrapJsTag.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
  bootstrapJsTag.integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" 
  bootstrapJsTag.crossOrigin = 'anonymous'
  return bootstrapJsTag
}