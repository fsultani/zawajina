import NavBar from './components/NavBar/NavBar.js';

const Body = () => {
  let content = `
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

export default Body;
