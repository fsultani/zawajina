(() => {
  const maritalStatus = document.querySelector('.marital-status');
  const maritalStatusValue = maritalStatus.getAttribute('data-maritalStatus');
  const maritalStatusArray = Array.from(maritalStatus);
  const index = maritalStatusArray.findIndex(item => item.value === maritalStatusValue);
  maritalStatus.selectedIndex = index;
})();
