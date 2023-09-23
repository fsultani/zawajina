const handleLogout = () => {
  const isMobileDevice = window.innerWidth <= 700;
  let element = 'mobile-logout-button-loading-spinner-wrapper'

  if (isMobileDevice) {
    const loader = getQuerySelectorById(element);
    loader.style.paddingTop = '10px';

    isSubmitting(element, true, '#00c6a7');
  } else {
    element = 'logout-button-loading-spinner-wrapper'
    const loader = getQuerySelectorById(element);
    Object.assign(loader.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      height: '20%',
    })

    loader.innerHTML += `
      <div class='loader-child'></div>
      <div class='loader-child'></div>
      <div class='loader-child'></div>
      <div class='loader-child'></div>
    `;

    document.querySelectorAll('.loader-child').forEach((element, index) => {
      Object.assign(element.style, {
        boxSizing: 'border-box',
        display: 'block',
        position: 'absolute',
        width: '30px',
        height: '30px',
        margin: '8px',
        border: '3px solid #00c6a7',
        borderRadius: '50%',
        animation:
          'animation-360-loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        borderColor: '#00c6a7 transparent transparent transparent',
        opacity: '1',
        zIndex: '999',
        animationDelay: index === 0 ? '-0.45s' : index === 1 ? '-0.3s' : index === 2 ? '-0.15s' : '',
      })
    })

    document.body.addEventListener('click', event => {
      event.preventDefault();
    })
  }

  Axios({
    method: 'post',
    apiUrl: '/api/auth-session/logout', // server/routes/auth/logout.js
  })
    .then(({ data }) => {
      Cookies.remove('my_match_authToken');
      Cookies.remove('my_match_ipToken');
      window.location.pathname = data?.url;
    })
}
