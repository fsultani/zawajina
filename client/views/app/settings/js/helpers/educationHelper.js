(() => {
  const education = document.querySelector('.education');
  const educationValue = education.getAttribute('data-education');
  const educationArray = Array.from(education);
  const index = educationArray.findIndex(item => item.value === educationValue);
  education.selectedIndex = index;
})();
