(() => {
  const hasChildren = document.querySelector('.has-children');
  const hasChildrenValue = hasChildren.getAttribute('data-hasChildren');
  document.getElementById(`has-children-${hasChildrenValue.toLowerCase()}`).checked = true;
})();
