(() => {
  const canRelocate = document.querySelector('.can-relocate');
  const relocateValue = canRelocate.getAttribute('data-can-relocate');
  const relocateArray = Array.from(canRelocate);
  const index = relocateArray.findIndex(item => item.value === relocateValue);
  canRelocate.selectedIndex = index;
})();
