const aboutMeHelper = ({ reset }) => {
  const editAboutMe = document.querySelector('.edit-about-me');
  const aboutMeValue = getQuerySelector('#about-me-value').innerHTML;
  editAboutMe.innerHTML = replaceBreakTag(aboutMeValue);

  let characterCount = aboutMeValue.length;
  document.getElementById('about-me-character-count').innerHTML = `${characterCount}/100`;
  document.getElementById('about-me-character-count').style.cssText =
    characterCount < 100 ? 'color: #777;' : 'color: green;';

  editAboutMe.addEventListener('keyup', e => {
    characterCount = e.target.value.length;
    document.getElementById('about-me-character-count').innerHTML = `${characterCount}/100`;
    document.getElementById('about-me-character-count').style.cssText =
      characterCount < 100 ? 'color: #777;' : 'color: green;';
  });

  if (reset) {
    removeErrorClass('.about-me-error');
    document.querySelector('#about-me-error-text').innerHTML = '';
    headerElements.forEach(element => {
      element.style.height = '40px';
    });
  }
}
