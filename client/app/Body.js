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
                <img src="https://my-match.s3.amazonaws.com/5eeabf03df48026ce9ea2b62/ohqp3ck0q1lozyaov17h38.jpg" alt="Girl 1">
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
