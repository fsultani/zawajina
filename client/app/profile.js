const Profile = userId => {
  const profileStylesTag = document.createElement('link');
  profileStylesTag.rel = "stylesheet";
  profileStylesTag.type = "text/css";
  profileStylesTag.href = '/static/client/app/profile-styles.css';

  document.head.appendChild(profileStylesTag);

  axios.get(`/user/api/info/${userId}`, {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(({ data }) => {
    const { user } = data;
    console.log('user:\n', user)
    const { photos, name, age, city, state, country } = user;
    const content = `
      <div class="profile-container">
        <div class="profile-inner-container">
          <div class="profile-wrapper">
            <div class="profile-image">
              <img src=${photos[0]} alt="Girl 1">
            </div>
          </div>

          <div class="profile-right-column">
            <p>${name}, ${age}</p>
            ${country === 'United States' ? `
              <p>${city}, ${state}</p>` :
              `<p>${city}, ${country}</p>`
            }
          </div>
        </div>
      </div>
    `;

    document.querySelector('#app').innerHTML = content;
  }).catch(err => {
    window.location.pathname = '/';
  })
};

const About = () => {
  let content = `
    <h2 class="testimonials-header">About Us</h2>
  `;

  axios.get("/api/all-members", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    content += `
      <div class="testimonials">
        ${
          res.data.all.map(member => (`
            <div class="testimonial-wrapper">
              <div class="testimonial-image">
                <img src="/static/client/app/images/girl-${Math.floor(Math.random() * 5) + 1}.jpg" alt="Girl 1">
              </div>
              <div class="testimonial-body">
                <div class="testimonial-name">${member.name}, ${member.age}</div>
                <p class="location">${member.city}</p>
                <p class="country">${member.country}</p>
              </div>
            </div>
          `)).join('')
        }
      </div>
    `;

    document.querySelector('#app').innerHTML = content;
  }).catch(err => {
    console.error("err.response\n", err.response);
    Cookies.remove('token');
    window.location.pathname = '/login';
  })
}

const Contact = () => {
  document.querySelector('#app').innerHTML = `<h1>Contact page</h1>`;
}

const Search = () => {
  document.querySelector('#app').innerHTML = `<h1>Search page</h1>`;
}

export { Profile, About, Contact, Search };
