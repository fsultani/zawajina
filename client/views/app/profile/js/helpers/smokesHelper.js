(() => {
  const smokes = document.querySelector('.smokes');
  const smokesValue = smokes.getAttribute('data-smokes');
  document.getElementById(`smokes-${smokesValue.toLowerCase()}`).checked = true;
})();
