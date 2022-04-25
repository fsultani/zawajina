(() => {
  const religiousConvictions = document.querySelector('.religious-convictions');
  const religiousConvictionValue = religiousConvictions.getAttribute('data-religiousConviction');
  const religiousConvictionsArray = Array.from(religiousConvictions);
  const index = religiousConvictionsArray.findIndex(item => item.value === religiousConvictionValue);
  religiousConvictions.selectedIndex = index;
})();
