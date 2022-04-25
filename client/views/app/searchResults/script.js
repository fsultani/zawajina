(() => {
  const pagination = document.querySelector('.pagination');
  const paginationDataset = Object.assign({}, pagination.dataset);
  const previousPage = Number(paginationDataset.previouspage);
  const numberOfPages = Number(paginationDataset.numberofpages);
  const currentPage = Number(paginationDataset.currentpage);
  const nextPage = Number(paginationDataset.nextpage);

  const { pathname, search } = new URL(window.location.href);
  const params = new URLSearchParams(search);

  if (previousPage) {
    if (previousPage === 1) {
      /*
        The previous page is the first page
       */
      params.delete('page')
    } else {
      params.set('page', previousPage)
    }
    /*
      Dipslay the previous page number and the left arrow
    */
    const url = `${pathname}?${params.toString()}`;
    pagination.innerHTML += `<a href="${url}">❮</a>`;
    pagination.innerHTML += `<a href="${url}">${previousPage}</a>`;
  }

  if (numberOfPages > 1) {
    /*
      Highlight the current page
    */
    pagination.innerHTML += `<a href="#" style="pointer-events: none;" class="active">${currentPage}</a>`;
  }

  if (nextPage) {
    /*
      Dipslay the next page number
    */
    params.set('page', nextPage)
    const url = `${pathname}?${params.toString()}`;
    pagination.innerHTML += `<a href="${url}">${nextPage}</a>`;

    if (numberOfPages > 2 && currentPage === 1) {
      /*
        Dipslay the third page over if the user is on the first page
      */
      params.set('page', nextPage + 1)
      const url = `${pathname}?${params.toString()}`;
      pagination.innerHTML += `<a href="${url}">${nextPage + 1}</a>`;
    }
    /*
      Dipslay the right arrow
    */
    pagination.innerHTML += `<a href="${url}">❯</a>`
  }
})();
