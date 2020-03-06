const Body = () => {
  const bodyStyles = document.createElement('link');
  bodyStyles.rel = "stylesheet"
  bodyStyles.href = '/static/client/app/body-styles.css';

  document.head.appendChild(bodyStyles);

  axios.get("/api/user-details").then(res => {
    const { name } = res.data;
    const Content = `
      <div class="container">
        <p>Salaam ${name}!</p>
      </div>

        <section class="testimonials section">
          <div class="container">
            <div class="testimonials-inner section-inner">
              <h2 class="section-title mt-0 text-center">Recently Active</h2>
              <div class="testimonials-wrap">
                <div class="testimonial is-revealing">
                  <div class="testimonial-inner">
                    <div class="testimonial-main mb-32">
                      <div class="testimonial-body">
                        <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                      </div>
                    </div>
                    <div class="testimonial-footer">
                      <div class="testimonial-image">
                        <img src="/static/client/landing-page/images/testimonial-01.png" alt="Mark Walker">
                      </div>
                      <div class="testimonial-name text-sm">Mark Walker</div>
                    </div>
                  </div>
                </div>
                <div class="testimonial is-revealing">
                  <div class="testimonial-inner">
                    <div class="testimonial-main mb-32">
                      <div class="testimonial-body">
                        <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                      </div>
                    </div>
                    <div class="testimonial-footer">
                      <div class="testimonial-image">
                        <img src="/static/client/landing-page/images/testimonial-02.png" alt="Marta Smirth">
                      </div>
                      <div class="testimonial-name text-sm">Marta Smirth</div>
                    </div>
                  </div>
                </div>
                <div class="testimonial is-revealing">
                  <div class="testimonial-inner">
                    <div class="testimonial-main mb-32">
                      <div class="testimonial-body">
                        <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                      </div>
                    </div>
                    <div class="testimonial-footer">
                      <div class="testimonial-image">
                        <img src="/static/client/landing-page/images/testimonial-03.png" alt="Evan Hill">
                      </div>
                      <div class="testimonial-name text-sm">Evan Hill</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    `;
    document.getElementById('main-app').innerHTML = Content;
  })
}

export default Body;
