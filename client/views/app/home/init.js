window.onload = () => {
  const page = Number(window.location.search.split('=')[1]);

  if (page === 1) window.location.href = `${window.location.origin}/users`;
};
