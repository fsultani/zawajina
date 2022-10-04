(() => {
  const pathname = window.location.pathname;

  if (pathname === '/likes') {
    document.getElementById('likes').classList.add('active');
  } else if (pathname === '/likes-me') {
    document.getElementById('likes-me').classList.add('active');
  }
})();
