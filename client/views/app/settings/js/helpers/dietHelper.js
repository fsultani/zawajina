(() => {
  const diet = document.querySelector('.diet');
  const dietValue = diet.getAttribute('data-diet');
  const dietArray = Array.from(diet);
  const index = dietArray.findIndex(item => item.value === dietValue);
  diet.selectedIndex = index;
})();
