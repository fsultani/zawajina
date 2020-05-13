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

        <form name="image-upload" enctype="multipart/form-data" onsubmit="return false" novalidate>
          <p>
            <input type="text" name="title" placeholder="optional title"/>
          </p>

          <p>
            <input type="file" name="upl"/>
          </p>

          <p>
            <button
              name="uploadButton"
            >
              Upload Image
            </button>
          </p>
        </form>
        <h2 class="testimonials-header">Recently Active</h2>
        <div class="testimonials">
          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/app/images/girl-1.jpg" alt="Girl 1">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 1, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/app/images/girl-2.jpg" alt="Girl 2">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 2, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/app/images/girl-3.jpg" alt="Girl 3">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 3, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/app/images/girl-4.jpg" alt="Girl 4">
            </div>
            <div class="testimonial-body">
              <div class="testimonial-name">Girl 4, 36</div>
              <p class="location">Irvine, CA</p>
              <p class="country">USA</p>
            </div>
          </div>

          <div class="testimonial-wrapper">
            <div class="testimonial-image">
              <img src="/static/client/app/images/girl-5.jpg" alt="Girl 5">
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

    const formData = document.forms.namedItem('image-upload');
    formData.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(formData)
      axios.post('/api/upload', data).then(res => {
        console.log("res\n", res);
      })
    })

  }).catch(error => {
    Cookies.remove('token')
    window.location.pathname = '/login';
  })
}

export default Body;
