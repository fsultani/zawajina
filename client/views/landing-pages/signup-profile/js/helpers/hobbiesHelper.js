const hobbiesInput = document.querySelector('#hobbiesInput');
let allHobbiesList;

const handleHobbiesClick = item => {
  const errorMessage = document.getElementById('hobbies-error-message');

  let selectedHobbiesCount = allHobbiesList.filter(hobby => hobby.isSelected).length;

  if (selectedHobbiesCount >= 5) {
    document.getElementById(item).checked = false;

    errorMessage.innerHTML = ' - Limit 5';

    return Object.assign(errorMessage.style, {
      color: 'red',
    })
  }

  errorMessage.innerHTML = '';

  const index = allHobbiesList.findIndex(hobby => hobby.name === item);
  const object = allHobbiesList[index]
  object.isSelected = !object.isSelected;

  hobbiesInput.value = '';
  hobbiesInput.focus();

  renderHobbies();
}

const renderCheckedHobbies = () => {
  document.querySelectorAll('.hobbies-input').forEach(option => {
    const isSelected = option.dataset.isSelected === 'true';

    option.checked = isSelected;
  });
}

const renderHobbies = (userInput = '') => {
  const hobbiesOptionsHTML = [];
  let allHobbiesListScope = allHobbiesList.filter(hobby => !hobby.isSelected)
  let selectedHobbiesScope = allHobbiesList.filter(hobby => hobby.isSelected)

  const hobbies = [...selectedHobbiesScope, ...allHobbiesListScope];

  hobbies
    .filter(
      element => element.name.toLowerCase().includes(userInput)
    )
    .map(hobby => hobbiesOptionsHTML.push(`
    <label class='label' for='${hobby.name}' style='background-color: ${hobby.isSelected ? '#006C35' : ''};'>
      <span style='color: ${hobby.isSelected ? '#fff' : ''};'>${hobby.name}</span>
      <input class='hobbies-input' onclick='handleHobbiesClick("${hobby.name}")' type='checkbox' id='${hobby.name}' data-is-Selected='${hobby.isSelected}'>
    </label>
  `));

  const hobbiessOptions = document.getElementById('hobbies-list');

  hobbiessOptions.innerHTML = hobbiesOptionsHTML.join('');

  renderCheckedHobbies();
}

(async () => {
  const { allHobbies } = await getAllHobbies();
  allHobbiesList = allHobbies.map(hobby => ({
    name: hobby,
    isSelected: false,
  }))

  renderHobbies();

  hobbiesInput.addEventListener(
    'input',
    debounce(async event => {
      const userInput = event.target.value.toLowerCase().trim();
      if (!userInput) {
        renderHobbies();
        return false;
      }

      renderHobbies(userInput);
    }, 250)
  );
})();
