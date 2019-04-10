const Home = () => document.getElementById('app').innerHTML = `
  <div class="body-wrap boxed-container">
    <header class="site-header text-light">
      <div class="container">
        <div class="site-header-inner">
          <div class="brand header-brand">
            <h1 class="m-0">
              <a href="#">
                <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient x1="114.674%" y1="39.507%" x2="-52.998%" y2="39.507%" id="logo-a">
                      <stop stop-color="#ffffff" offset="0%"/>
                      <stop stop-color="#ffffff" stop-opacity="0" offset="100%"/>
                    </linearGradient>
                    <linearGradient x1="93.05%" y1="19.767%" x2="15.034%" y2="85.765%" id="logo-b">
                      <stop stop-color="#FF3058" offset="0%"/>
                      <stop stop-color="#FF6381" offset="100%"/>
                    </linearGradient>
                    <linearGradient x1="32.716%" y1="-20.176%" x2="32.716%" y2="148.747%" id="logo-c">
                      <stop stop-color="#FF97AA" offset="0%"/>
                      <stop stop-color="#FF97AA" stop-opacity="0" offset="100%"/>
                    </linearGradient>
                  </defs>
                  <g fill="none" fill-rule="evenodd">
                    <path d="M31.12 7.482C28.327 19.146 19.147 28.326 7.483 31.121A12.04 12.04 0 0 1 .88 24.518C3.674 12.854 12.854 3.674 24.518.879a12.04 12.04 0 0 1 6.603 6.603z" fill="#ffffff"/>
                    <path d="M28.874 3.922l-24.91 24.99a12.026 12.026 0 0 1-3.085-4.394C3.674 12.854 12.854 3.674 24.518.879a12.025 12.025 0 0 1 4.356 3.043z" fill="url(#logo-a)"/>
                    <g opacity=".88">
                      <path d="M31.12 24.518a12.04 12.04 0 0 1-6.602 6.603C12.854 28.326 3.674 19.146.879 7.482A12.04 12.04 0 0 1 7.482.88c11.664 2.795 20.844 11.975 23.639 23.639z" fill="url(#logo-b)"/>
                      <path d="M24.518 31.12C12.854 28.327 3.674 19.147.879 7.483A12.015 12.015 0 0 1 3.46 3.57L28.47 28.5a12.016 12.016 0 0 1-3.951 2.62z" fill="url(#logo-c)"/>
                    </g>
                  </g>
                </svg>
              </a>
            </h1>
          </div>
          ${Cookies.get('token') ? `
            <ul class="header-links list-reset m-0">
              <li>
                <button class="button button-sm button-shadow" onclick="handleLogout(event)">Logout</button>
              </li>
            </ul>` : `
            <ul class="header-links list-reset m-0">
              <li>
                <a href="#login">Login</a>
              </li>
              <li>
                <a class="button button-sm button-shadow button-signup" href="#">Signup</a>
              </li>
            </ul>
            `
          }
        </div>
      </div>
    </header>

    <main>
      <section class="hero text-center text-light">
        <div class="container-sm">
          <div class="hero-inner">
            <div class="hero-copy">
              ${Cookies.get('token') ? `<span style="color: #fff">Welcome, ${Cookies.get('name')}!</span>` : ''}
              <h1 class="hero-title mt-0">Find your other half</h1>
              <p class="hero-paragraph">Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.</p>
              <div class="hero-cta">
                <a class="button button-secondary button-shadow" href="#">Get started now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="features section">
        <div class="container">
          <div class="features-inner section-inner has-bottom-divider">
            <div class="features-header text-center">
              <div class="container-sm">
                <h2 class="section-title mt-0 is-revealing">Duis aute irure dolor in reprehenderit in voluptate velit esse-cillum dolore eu fugiat pariatur.</h2>
                <img class="features-illustration is-revealing" src="/static/images/features-illustration.svg" alt="Features illustration">
              </div>
            </div>
            <div class="features-wrap">
              <div class="feature text-center is-revealing">
                <div class="feature-inner">
                  <div class="feature-icon mb-16">
                    <img src="/static/images/feature-01.svg" alt="Feature 01">
                  </div>
                  <div class="feature-content">
                    <h4 class="feature-title mt-0 mb-8">Discover</h4>
                    <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                  </div>
                </div>
              </div>
              <div class="feature text-center is-revealing">
                <div class="feature-inner">
                  <div class="feature-icon mb-16">
                    <img src="/static/images/feature-02.svg" alt="Feature 02">
                  </div>
                  <div class="feature-content">
                    <h4 class="feature-title mt-0 mb-8">Discover</h4>
                    <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="features-wrap">
              <div class="feature text-center is-revealing">
                <div class="feature-inner">
                  <div class="feature-icon mb-16">
                    <img src="/static/images/feature-03.svg" alt="Feature 03">
                  </div>
                  <div class="feature-content">
                    <h4 class="feature-title mt-0 mb-8">Discover</h4>
                    <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                  </div>
                </div>
              </div>
              <div class="feature text-center is-revealing">
                <div class="feature-inner">
                  <div class="feature-icon mb-16">
                    <img src="/static/images/feature-04.svg" alt="Feature 04">
                  </div>
                  <div class="feature-content">
                    <h4 class="feature-title mt-0 mb-8">Discover</h4>
                    <p class="text-sm mb-0">A pseudo-Latin text used in web design, layout, and printing in place of things to emphasise design.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="features-extended section">
        <div class="features-extended-inner section-inner">
          <div class="features-extended-header text-center">
            <div class="container-sm">
              <h2 class="section-title mt-0">What makes Ruby great</h2>
              <p class="section-paragraph">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur sed vulputate mi sit.</p>
            </div>
          </div>
          <div class="features-extended-wrap">
            <div class="container">
              <div class="feature-extended">
                <div class="feature-extended-image is-revealing">
                  <img src="/static/images/feature-extended-01.svg" alt="Feature extended 01">
                </div>
                <div class="feature-extended-body is-revealing">
                  <h3 class="mt-0">Freedom from designers</h3>
                  <p class="mb-0">Nisi porta lorem mollis aliquam ut. Ac tincidunt vitae semper quis lectus nulla at volutpat. Est ultricies integer quis auctor elit sed.</p>
                </div>
              </div>
              <div class="feature-extended">
                <div class="feature-extended-image is-revealing">
                  <img src="/static/images/feature-extended-02.svg" alt="Feature extended 02">
                </div>
                <div class="feature-extended-body is-revealing">
                  <h3 class="mt-0">Freedom from designers</h3>
                  <p class="mb-0">Nisi porta lorem mollis aliquam ut. Ac tincidunt vitae semper quis lectus nulla at volutpat. Est ultricies integer quis auctor elit sed.</p>
                </div>
              </div>
              <div class="feature-extended">
                <div class="feature-extended-image is-revealing">
                  <img src="/static/images/feature-extended-03.svg" alt="Feature extended 03">
                </div>
                <div class="feature-extended-body is-revealing">
                  <h3 class="mt-0">Freedom from designers</h3>
                  <p class="mb-0">Nisi porta lorem mollis aliquam ut. Ac tincidunt vitae semper quis lectus nulla at volutpat. Est ultricies integer quis auctor elit sed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="pricing section text-light">
        <div class="container">
          <div class="pricing-inner section-inner">
            <h2 class="section-title mt-0 text-center">Simple, transparent pricing</h2>
            <div class="pricing-tables-wrap">
              <div class="pricing-table is-revealing">
                <div class="pricing-table-inner">
                  <div class="pricing-table-main">
                    <div class="pricing-table-header mb-24 pb-24">
                      <div class="pricing-table-title text-sm mt-0 mb-12">Individual</div>
                      <div class="pricing-table-price"><span class="pricing-table-price-currency">$</span><span class="pricing-table-price-amount h1">19</span>/m</div>
                    </div>
                    <div class="pricing-table-features-title text-xs mb-24">Top features</div>
                    <ul class="pricing-table-features list-reset text-xs">
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                    </ul>
                  </div>
                  <div class="pricing-table-cta">
                    <a class="button button-primary button-block" href="#">Free trial</a>
                  </div>
                </div>
              </div>
              <div class="pricing-table is-revealing">
                <div class="pricing-table-inner">
                  <div class="pricing-table-main">
                    <div class="pricing-table-header mb-24 pb-24">
                      <div class="pricing-table-title text-sm mt-0 mb-12">Agency</div>
                      <div class="pricing-table-price"><span class="pricing-table-price-currency">$</span><span class="pricing-table-price-amount h1">49</span>/m</div>
                    </div>
                    <div class="pricing-table-features-title text-xs mb-24">Top features</div>
                    <ul class="pricing-table-features list-reset text-xs">
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                    </ul>
                  </div>
                  <div class="pricing-table-cta">
                    <a class="button button-primary button-block" href="#">Free trial</a>
                  </div>
                </div>
              </div>
              <div class="pricing-table is-revealing">
                <div class="pricing-table-inner">
                  <div class="pricing-table-main">
                    <div class="pricing-table-header mb-24 pb-24">
                      <div class="pricing-table-title text-sm mt-0 mb-12">Enterprise</div>
                      <div class="pricing-table-price"><span class="pricing-table-price-currency">$</span><span class="pricing-table-price-amount h1">69</span>/m</div>
                    </div>
                    <div class="pricing-table-features-title text-xs mb-24">Top features</div>
                    <ul class="pricing-table-features list-reset text-xs">
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                      <li>
                        <span>Excepteur sint occaecat velit</span>
                      </li>
                    </ul>
                  </div>
                  <div class="pricing-table-cta">
                    <a class="button button-secondary button-block" href="#">Buy it now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials section">
        <div class="container">
          <div class="testimonials-inner section-inner">
            <h2 class="section-title mt-0 text-center">Loved by users worldwide</h2>
            <div class="testimonials-wrap">
              <div class="testimonial is-revealing">
                <div class="testimonial-inner">
                  <div class="testimonial-main mb-32">
                    <div class="testimonial-rating mb-24">
                      <img src="/static/images/5-stars.svg" alt="Rating">
                    </div>
                    <div class="testimonial-body">
                      <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    </div>
                  </div>
                  <div class="testimonial-footer">
                    <div class="testimonial-image">
                      <img src="/static/images/testimonial-01.png" alt="Mark Walker">
                    </div>
                    <div class="testimonial-name text-sm">Mark Walker</div>
                  </div>
                </div>
              </div>
              <div class="testimonial is-revealing">
                <div class="testimonial-inner">
                  <div class="testimonial-main mb-32">
                    <div class="testimonial-rating mb-24">
                      <img src="/static/images/5-stars.svg" alt="Rating">
                    </div>
                    <div class="testimonial-body">
                      <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    </div>
                  </div>
                  <div class="testimonial-footer">
                    <div class="testimonial-image">
                      <img src="/static/images/testimonial-02.png" alt="Marta Smirth">
                    </div>
                    <div class="testimonial-name text-sm">Marta Smirth</div>
                  </div>
                </div>
              </div>
              <div class="testimonial is-revealing">
                <div class="testimonial-inner">
                  <div class="testimonial-main mb-32">
                    <div class="testimonial-rating mb-24">
                      <img src="/static/images/5-stars.svg" alt="Rating">
                    </div>
                    <div class="testimonial-body">
                      <p class="text-sm m-0">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    </div>
                  </div>
                  <div class="testimonial-footer">
                    <div class="testimonial-image">
                      <img src="/static/images/testimonial-03.png" alt="Evan Hill">
                    </div>
                    <div class="testimonial-name text-sm">Evan Hill</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta section text-light">
        <div class="container">
          <div class="cta-inner section-inner is-revealing">
            <h3 class="section-title mt-0">Nisi porta lorem mollis aliquam ut.</h3>
            <div class="cta-cta">
              <a class="button button-wide-mobile" href="#">Get started</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer-inner">
          <div class="site-footer-top">
            <div class="site-footer-unit">
              <div class="site-footer-unit-inner">
                <div class="brand footer-brand mb-24">
                  <a href="#">
                    <img src="/static/images/logo.svg" alt="Logo">
                  </a>
                </div>
                <ul class="footer-social-links list-reset">
                  <li>
                    <a href="#">
                      <span class="screen-reader-text">Facebook</span>
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" fill="#FFF" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span class="screen-reader-text">Twitter</span>
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" fill="#FFF" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span class="screen-reader-text">Google</span>
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" fill="#FFF" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="site-footer-unit">
              <div class="site-footer-unit-inner">
                <div class="footer-top-links">
                  <div class="footer-title mb-16">Company</div>
                  <ul class="list-reset">
                    <li>
                      <a href="#">Dummy text used</a>
                    </li>
                    <li>
                      <a href="#">The purpose of lorem</a>
                    </li>
                    <li>
                      <a href="#">Filler text can be very useful</a>
                    </li>
                    <li>
                      <a href="#">Be on design</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="site-footer-unit">
              <div class="site-footer-unit-inner">
                <div class="footer-top-links">
                  <div class="footer-title mb-16">Use cases</div>
                  <ul class="list-reset">
                    <li>
                      <a href="#">Consectetur adipiscing</a>
                    </li>
                    <li>
                      <a href="#">Lorem Ipsum is place</a>
                    </li>
                    <li>
                      <a href="#">Excepteur sint</a>
                    </li>
                    <li>
                      <a href="#">Occaecat cupidatat</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="site-footer-unit">
              <div class="site-footer-unit-inner">
                <div class="footer-top-links">
                  <div class="footer-title mb-16">Docs</div>
                  <ul class="list-reset">
                    <li>
                      <a href="#">The purpose of lorem</a>
                    </li>
                    <li>
                      <a href="#">Dummy text used</a>
                    </li>
                    <li>
                      <a href="#">Excepteur sint</a>
                    </li>
                    <li>
                      <a href="#">Occaecat cupidatat</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="site-footer-bottom">
            <ul class="footer-bottom-links list-reset">
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">FAQ's</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
            </ul>
            <div class="footer-copyright">&copy; 2018 Ruby, all rights reserved</div>
          </div>
        </div>
      </div>
    </footer>
  </div>
`;

export default Home;
