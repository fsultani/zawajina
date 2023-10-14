const handleBlockReportUserMenu = () => {
  const dropdownContent = document.querySelector('.block-report-user-dropdown-content');
  dropdownContent.classList.toggle('show-block-report-user-dropdown-content');
};

document.addEventListener('click', event => {
  const pathname = window.location.pathname
  if (pathname !== '/profile') {
    const targetName = event.target.classList.value;
    const dropdownContent = document.querySelector('.block-report-user-dropdown-content').classList;

    if (
      targetName !== 'ellipsis-dot' &&
      targetName !== 'ellipsis-menu' &&
      dropdownContent.contains('show-block-report-user-dropdown-content')
    ) {
      dropdownContent.remove('show-block-report-user-dropdown-content');
    }
  }
});
