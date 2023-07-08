const aboutMyMatchHelper = ({ reset }) => {
  const editAboutMyMatch = document.querySelector('.edit-about-my-match');
  const aboutMyMatchValue = getQuerySelector('#about-my-match-value').innerHTML;
  editAboutMyMatch.innerHTML = replaceBreakTag(aboutMyMatchValue);

  let characterCount = aboutMyMatchValue.length;
  document.getElementById('about-my-match-character-count').innerHTML = `${characterCount}/100`;
  document.getElementById('about-my-match-character-count').style.cssText =
    characterCount < 100 ? 'color: #777;' : 'color: green;';

  editAboutMyMatch.addEventListener('keyup', e => {
    characterCount = aboutMyMatchValue.length;
    document.getElementById('about-my-match-character-count').innerHTML = `${characterCount}/100`;
    document.getElementById('about-my-match-character-count').style.cssText =
      characterCount < 100 ? 'color: #777;' : 'color: green;';
  });

  if (reset) {
    removeErrorClass('.about-my-match-error');
    document.querySelector('#about-my-match-error-text').innerHTML = '';
    headerElements.forEach(element => {
      element.style.height = '40px';
    });
  }
}
