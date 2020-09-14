(() => {
  const NavBar = `
    <div class="navbar--site-header">
      <div class="navbar--container">
        <div class="navbar--site-header-inner">
          <div>
            <a href="/"><img src="/static/client/landing-page/images/home.svg" alt="Home"></a>
          </div>
          <ul class="navbar--header-links margin-0">
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a id="logout" style="cursor: pointer">Logout</a></li>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const profile = "<h1>Profile page</h1>";

  if (window.location.pathname === "/") {
    axios
      .get("/api/all-members", {
        headers: {
          Authorization: Cookies.get("token"),
        },
      })
      .then(res => {
        const content = `
        <h2 class="testimonials-header">Recently Active</h2>
        <div class="testimonials">
          ${res.data.all
            .map(
              member => `
              <div class="testimonial-wrapper">
                <div class="testimonial-image">
                  <img src="/static/client/app/images/girl-${
                    Math.floor(Math.random() * 5) + 1
                  }.jpg" alt="Girl 1">
                </div>
                <div class="testimonial-body">
                  <div class="testimonial-name">${member.name}, ${member.age}</div>
                  <p class="location">${member.city}</p>
                  <p class="country">${member.country}</p>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
        document.querySelector("#app").innerHTML = NavBar + content;

        document.querySelector("#logout").onclick = () => {
          // Cookies.remove('token');
          // window.location.pathname = '/login';
        };
      })
      .catch(err => {
        console.error("err.response\n", err.response);
        // Cookies.remove('token');
        // window.location.pathname = '/login';
      });
  }

  // if (window.location.pathname === '/profile') {
  //   const profile = '<h1>Profile page</h1>';
  //   document.querySelector('#app').innerHTML = NavBar + profile;
  // }

  // window.addEventListener('hashchange', event => {
  //   event.preventDefault();
  //   const { hash } = window.location;
  //   console.log("hash\n", hash);
  //   if (hash === '#profile') {
  //     window.history.pushState({ page: 'profile'}, null, '/profile');
  //     document.querySelector('#app').innerHTML = NavBar + profile;
  //   } else if (hash === '#home') {
  //     window.history.pushState({ page: 'home'}, null, '/');
  //     axios.get("/api/all-members", {
  //       headers: {
  //         Authorization: Cookies.get('token')
  //       }
  //     }).then(res => {
  //       const content = `
  //         <h2 class="testimonials-header">Recently Active</h2>
  //         <div class="testimonials">
  //           ${
  //             res.data.all.map(member => (`
  //               <div class="testimonial-wrapper">
  //                 <div class="testimonial-image">
  //                   <img src="/static/client/app/images/girl-${Math.floor(Math.random() * 5) + 1}.jpg" alt="Girl 1">
  //                 </div>
  //                 <div class="testimonial-body">
  //                   <div class="testimonial-name">${member.name}, ${member.age}</div>
  //                   <p class="location">${member.city}</p>
  //                   <p class="country">${member.country}</p>
  //                 </div>
  //               </div>
  //             `)).join('')
  //           }
  //         </div>
  //       `
  //       document.querySelector('#app').innerHTML = NavBar + content;

  //       document.querySelector('#logout').onclick = () => {
  //         Cookies.remove('token');
  //         window.location.pathname = '/login';
  //       }
  //     }).catch(err => {
  //       console.error("err.response\n", err.response);
  //       Cookies.remove('token');
  //       window.location.pathname = '/login';
  //     })
  //   }
  // })
})();
