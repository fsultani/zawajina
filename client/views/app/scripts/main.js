const openDropdownMenu = () => {
  const dropdownContent = document.querySelector('.dropdown-menu-content').classList;
  document.querySelector('#menu-arrow').classList.toggle('up-arrow');
  if (!dropdownContent.contains('show-dropdown-menu-content')) {
    dropdownContent.add('show-dropdown-menu-content');
  } else {
    dropdownContent.remove('show-dropdown-menu-content');
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

const handleLogout = () => {
  Cookies.remove('my_match_authToken');
  window.location.pathname = '/login';
};

document.addEventListener('click', event => {
  const targetName = event.target.classList.value;
  const isDropdownContentVisible = document.querySelector('.dropdown-menu-content').classList;

  if (
    targetName !== 'dropdown-button' &&
    targetName !== 'dropdown-item' &&
    isDropdownContentVisible.contains('show-dropdown-menu-content')
  ) {
    document.querySelector('.dropdown-menu-content').classList.remove('show-dropdown-menu-content');
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
