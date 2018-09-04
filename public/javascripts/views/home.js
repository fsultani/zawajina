export default (() => {
  let welcomeHome;
  if (Cookies.get('token')) {
    welcomeHome = `
      <center>
        <h1>Welcome home, ${Cookies.get('name')}!</h1>
        <h3>All members on this site</h3>
      </center>
    `;
  } else {
    welcomeHome = `
      <center>
        <h1>Welcome!</h1>
        <h4>Please log in or create a free account</h4>
      </center>
    `;
  }

  return welcomeHome;
})