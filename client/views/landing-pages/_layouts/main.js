setTimeout(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  // Display slow network message for non Safari users after 5 seconds
  if (connection) {
    const type = connection.effectiveType;
    if (type === '2g' || type === '3g') {
      getQuerySelector('#slow-network-warning').style.display = 'flex';
    }
  }
}, 1000);
