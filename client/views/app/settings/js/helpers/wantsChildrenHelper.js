(() => {
  const wantsChildren = document.querySelector('.wants-children');
  const wantsChildrenValue = wantsChildren.getAttribute('data-wantsChildren');
  document.getElementById(`wants-children-${wantsChildrenValue.toLowerCase()}`).checked = true;
})();
