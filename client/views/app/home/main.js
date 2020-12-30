(async () => {
  const page = window.location.search;
  const response = await axios.get(`/api/all-members${page}`, {
    headers: {
      Authorization: Cookies.get("token"),
    },
  });

  const { allUsersCount, allUsers } = response.data;

  const content = allUsers.map(user => `
    <a href="/user/${user._id}" style="text-decoration: none">
      <div class="testimonial-wrapper">
        <div class="testimonial-image">
          <img src="${
            user.photos.length > 0
              ? user.photos[0]
              : user.gender === "male"
              ? "https://my-match.s3.amazonaws.com/male.png"
              : "https://my-match.s3.amazonaws.com/female.png"
          }" />
        </div>
        <div class="testimonial-body">
          <div class="testimonial-name">${user.name}, ${user.age}</div>
          <p class="location">
            ${user.city}, ${user.state !== null ? `${user.state}, ${user.country}` : user.country}
          </p>
        </div>
      </div>
    </a>
  `).join('');

  const numberOfPages = Math.ceil(allUsersCount / 20);
  const currentPage = parseInt(page.split('=')[1]) || 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

  if (currentPage <= numberOfPages) {
    // Display pagination
    const pagination = `
      <div class="pagination">
        ${
          previousPage ?
            previousPage === 1 ? `<a href="/users">❮</a>` : `<a href="/users?page=${currentPage - 1}">❮</a>`
          : ''
        }

        ${numberOfPages > 2 && currentPage === numberOfPages ? `<a href="/users?page=${previousPage - 1}">${previousPage - 1}</a>` : ''}

        ${
          previousPage ?
            previousPage === 1 ? `<a href="/users">${previousPage}</a>` : `<a href="/users?page=${previousPage}">${previousPage}</a>`
          : ''
        }

        <a href="#" style="pointer-events: none;" class="active">${currentPage}</a>
        ${nextPage ? `<a href="/users?page=${nextPage}">${nextPage}</a>` : ''}
        ${numberOfPages > 2 && currentPage === 1 ? `<a href="/users?page=${nextPage + 1}">${nextPage + 1}</a>` : ''}
        ${nextPage ? `<a href="/users?page=${currentPage + 1}">❯</a>` : ''}
      </div>
    `;

    document.querySelector(`.loader`).style.display = 'none';
    document.querySelector(".users-container").innerHTML = content;
    document.querySelector(".pagination-container").innerHTML = pagination;
  } else {
    // User has gone to an unavailable page, so go to last available page
    window.location.search = `?page=${numberOfPages}`
  }
})();
