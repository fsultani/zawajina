const Body = () => {
  const bodyStyles = document.createElement('link');
  bodyStyles.rel = "stylesheet"
  bodyStyles.href = '/static/client/app/body-styles.css';

  document.head.appendChild(bodyStyles);

  axios.get("/api/user-details", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    const { name } = res.data;
    const Content = `
      <div class="container">
        <p class="username">Salaam ${name}!</p>
        <h2 class="testimonials-header">Recently Active</h2>
        <div class="testimonials">
          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/landing-page/images/girl_1.jpg" alt="Girl 1">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 1, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/landing-page/images/girl_2.jpg" alt="Girl 2">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 2, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/landing-page/images/girl_3.jpg" alt="Girl 3">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 3, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/landing-page/images/girl_4.jpg" alt="Girl 4">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 4, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/landing-page/images/girl_5.jpg" alt="Girl 5">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 5, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('main-app').innerHTML = Content;
  }).catch(error => {
    Cookies.remove('token')
    window.location.pathname = '/login';
  })
}

export default Body;
