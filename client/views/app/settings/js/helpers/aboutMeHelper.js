(() => {
  const aboutMe = document.querySelector('.about-me');
  const aboueMeValue = aboutMe.getAttribute('data-aboutMe');
  aboutMe.value = aboueMeValue;
})();
