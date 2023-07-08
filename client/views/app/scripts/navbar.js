const openNav = () => {
  document.getElementById('open-side-menu-mobile').style.width = '256px';
  document.querySelector('.mask').classList.add('mask-open');
};

const closeNav = () => {
  document.getElementById('open-side-menu-mobile').style.width = 0;
  document.querySelector('.mask').classList.remove('mask-open');
};

document.addEventListener('click', event => {
  const targetName = event.target.classList.value;
  const isSidenavOpen = document.getElementById('open-side-menu-mobile').style.width;

  if (targetName !== 'open-nav' && targetName !== 'side-menu-mobile' && isSidenavOpen === '256px') {
    closeNav();
  }
});
