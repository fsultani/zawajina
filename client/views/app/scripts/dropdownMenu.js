let dropdownContent;

const openDropdownMenu = () => {
  dropdownContent = document.querySelector('.dropdown-menu-content').classList;
  document.querySelector('#menu-arrow').classList.toggle('up-arrow');
  if (!dropdownContent.contains('show-dropdown-menu-content')) {
    dropdownContent.add('show-dropdown-menu-content');
  } else {
    dropdownContent.remove('show-dropdown-menu-content');
    document.querySelector('.dropdown-button').blur();
  }
};

document.addEventListener('click', event => {
  const targetName = event.target.classList.value;

  if (
    targetName !== 'dropdown-button' &&
    targetName !== 'dropdown-item' &&
    dropdownContent?.contains('show-dropdown-menu-content')
  ) {
    document.querySelector('.dropdown-menu-content').classList.remove('show-dropdown-menu-content');
    document.querySelector('#menu-arrow').classList.remove('up-arrow');
  }
});
