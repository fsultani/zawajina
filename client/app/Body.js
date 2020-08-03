const Body = () => {
  const profileStylesTag = document.createElement('link');
  profileStylesTag.rel = "stylesheet";
  profileStylesTag.type = "text/css";
  profileStylesTag.href = '/static/client/app/body-styles.css';

  const navBarStyles = document.createElement('link');
  navBarStyles.rel = "stylesheet";
  navBarStyles.type = "text/css";
  navBarStyles.href = '/static/client/app/components/NavBar/nav-bar-styles.css';

  const appGlobalStyles = document.createElement('link');
  appGlobalStyles.rel = "stylesheet";
  appGlobalStyles.type = "text/css";
  appGlobalStyles.href = '/static/client/app/app-global-styles.css';

  document.head.appendChild(profileStylesTag);
  document.head.appendChild(appGlobalStyles);
  document.head.appendChild(navBarStyles);

  let content = `
    <div class="main">
      <h2 class="testimonials-header">Recently Active</h2>
  `;

  axios.get("/api/all-members", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    content += `
      <div class="testimonials">
        ${
          res.data.all.map(user => (`
            <a href="/user/${user._id}" style="text-decoration: none">
              <div class="testimonial-wrapper">
                <div class="testimonial-image">
                  <img src=${user.photos[Math.floor(Math.random() * user.photos.length)]} alt="Photo 1">
                </div>
                <div class="testimonial-body">
                  <div class="testimonial-name">${user.name}, ${user.age}</div>
                  <p class="location">${user.city}</p>
                  <p class="country">${user.country}</p>
                </div>
              </div>
            </a>
          `)).join('')
        }
      </div>
      </div>
    `;

    document.querySelector('#app').innerHTML = content;
  }).catch(err => {
    Cookies.remove('token');
    window.location.pathname = '/login';
  })
}

export default Body;