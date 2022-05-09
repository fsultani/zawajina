(() => {
  const pathname = window.location.pathname;
  
  if (pathname === '/likes') {
    document.querySelector('.likes').classList.add('active');
  } else if (pathname === '/likes-me') {
    document.querySelector('.likes-me').classList.add('active');
  }
})();
