const openNav = () => {
  document.getElementById('open-side-menu-mobile').style.width = '150px';
};

const closeNav = () => {
  document.getElementById('open-side-menu-mobile').style.width = 0;
};

document.addEventListener('click', event => {
  const targetName = event.target.classList.value;

  if (
    targetName !== 'open-nav' &&
    targetName !== 'side-menu-mobile' &&
    targetName !== 'dropdown-item'
  ) {
    closeNav();
  }
});
