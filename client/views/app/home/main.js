(() => {
  let result = '<div class="testimonials">';
  let loading = 'Loading data...';
  document.querySelector('#home').innerHTML = loading;

  axios.get("/api/all-members", {
    headers: {
      Authorization: Cookies.get('token')
    }
  }).then(res => {
    const userId = res.data.user._id;
    document.querySelector('#profile').href = `/user/${userId}`;
    result += res.data.all.map(user => (`
      <a href="/user/${user._id}" style="text-decoration: none">
        <div class="testimonial-wrapper">
          <div class="testimonial-image">
            <img src=${user.photos[0]} alt="Photo 1">
          </div>
          <div class="testimonial-body">
            <div class="testimonial-name">${user.name}, ${user.age}</div>
            <p class="location">${user.city}</p>
            <p class="country">${user.country}</p>
          </div>
        </div>
      </a>
    `)).join('')
    result += '</div';

    document.querySelector('#home').innerHTML = result;
  }).catch(err => {
    Cookies.remove('token');
    window.location.pathname = '/login';
  })
})();
