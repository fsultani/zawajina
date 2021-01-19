const openDropdownMenu = () => {
  const dropdownContent = document.querySelector('.dropdown-content').classList;
  document.querySelector('#menu-arrow').classList.toggle('up-arrow');
  if (!dropdownContent.contains('show')) {
    dropdownContent.add('show');
  } else {
    dropdownContent.remove('show');
    document.querySelector('.dropdown-button').blur();
  }
};

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
  const isDropdownContentVisible = document.querySelector('.dropdown-content').classList;

  if (
    targetName !== 'dropdown-button' &&
    targetName !== 'dropdown-item' &&
    isDropdownContentVisible.contains('show')
  ) {
    document.querySelector('.dropdown-content').classList.remove('show');
    document.querySelector('#menu-arrow').classList.remove('up-arrow');
  }
});

document.addEventListener('click', event => {
  const targetName = event.target.classList.value;
  const isSidenavOpen = document.getElementById('open-side-menu-mobile').style.width;

  if (targetName !== 'open-nav' && targetName !== 'side-menu-mobile' && isSidenavOpen === '256px') {
    closeNav();
  }
});
