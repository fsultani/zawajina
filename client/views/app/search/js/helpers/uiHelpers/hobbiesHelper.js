let hobbiesList;
let selectedHobbies = [];

const handleHobbiesClick = item => {
  const errorMessage = document.getElementById('hobbies-error-message');

  if (!selectedHobbies.includes(item) && selectedHobbies.length >= 5) {
    document.getElementById(item).checked = false;

    errorMessage.innerHTML = ' - Limit 5';

    return Object.assign(errorMessage.style, {
      color: 'red',
    })
  }

  errorMessage.innerHTML = '';

  if (selectedHobbies.includes(item)) {
    const index = selectedHobbies.indexOf(item);
    selectedHobbies.splice(index, 1);
  } else {
    selectedHobbies.push(item)
  }

  renderHobbies(selectedHobbies);
}

const renderCheckedHobbies = () => {
  document.querySelectorAll('.hobbies-input').forEach(option => {
    if (selectedHobbies.includes(option.id)) {
      option.checked = true;
    }
  });
}

const renderHobbies = selectedHobbies => {
  const hobbiesOptionsHTML = [];
  let filteredHobbiesList = hobbiesList;

  selectedHobbies.map(selectedHobby => {
    const selectedHobbyIndex = hobbiesList.indexOf(selectedHobby);
    if (selectedHobbyIndex > -1) {
      filteredHobbiesList = filteredHobbiesList.filter(item => item !== selectedHobby);
    }
  })

  const hobbies = [...selectedHobbies, ...filteredHobbiesList];

  hobbies.map(item => hobbiesOptionsHTML.push(`
    <label class='label' for='${item}'>
      <span>${item}</span>
      <input class='hobbies-input' onclick='handleHobbiesClick("${item}")' type='checkbox' id='${item}'>
    </label>
  `));

  const hobbiessOptions = document.getElementById('hobbies-list');

  hobbiessOptions.innerHTML = hobbiesOptionsHTML.join('');

  renderCheckedHobbies();
}

(async () => {
  const { allHobbies } = await getAllHobbies();
  hobbiesList = allHobbies;
  renderHobbies(selectedHobbies);

  const hobbiesInput = document.querySelector('#hobbiesInput');
  const filterHobbies = userInput => {
    const filteredResults = allHobbies.filter(
      element => element.toLowerCase().indexOf(userInput) > -1
    );

    return filteredResults;
  };

  hobbiesInput.addEventListener(
    'input',
    debounce(async event => {
      const userInput = event.target.value.toLowerCase().trim();
      if (!userInput) {
        renderHobbies(selectedHobbies);
        return false;
      }

      const results = filterHobbies(userInput);
      renderHobbies(results, selectedHobbies);
    }, 250)
  );
})();
