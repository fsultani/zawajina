(() => {
  const relocate = document.querySelector('.relocate');
  const relocateValue = relocate.getAttribute('data-relocate');
  const relocateArray = Array.from(relocate);
  const index = relocateArray.findIndex(item => item.value === relocateValue);
  relocate.selectedIndex = index;
})();
