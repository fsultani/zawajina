(() => {
  const religiousValues = document.querySelector('.religious-values');
  const religiousValuesArray = Array.from(religiousValues.options);
  const religiousValuesValue = religiousValues.getAttribute('data-religiousValues');
  const index = religiousValuesArray.findIndex(item => item.value === religiousValuesValue);
  religiousValues.selectedIndex = index;
})();
