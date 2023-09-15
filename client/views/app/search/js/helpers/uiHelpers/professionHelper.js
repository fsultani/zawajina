const professionsList = [
  'Accountant',
  'Actor',
  'Aircraft pilot',
  'Architect',
  'Artist',
  'Athlete',
  'Baker',
  'Butcher',
  'Cashier',
  'Chef',
  'Cleaner',
  'Cook',
  'Dental hygienist',
  'Dentist',
  'Designer',
  'Dietitian',
  'Economist',
  'Electrician',
  'Engineer',
  'Farmer',
  'Firefighter',
  'Geologist',
  'Hairdresser',
  'Journalist',
  'Judge',
  'Lawyer',
  'Librarian',
  'Lifeguard',
  'Mail carrier',
  'Mechanic',
  'Occupational Therapist',
  'Optician',
  'Other',
  'Pharmacist',
  'Physician',
  'Plumber',
  'Police officer',
  'Psychologist',
  'Registered nurse',
  'Scientist',
  'Secretary',
  'Surgeon',
  'Tailor',
  'Teacher',
  'Technician',
  'Veterinarian',
  'Waiter',
  'Worker'
];

let profession;
let selectedProfessions = [];

const handleProfessionsClick = item => {
  const errorMessage = document.getElementById('profession-error-message');

  if (!selectedProfessions.includes(item) && selectedProfessions.length >= 3) {
    document.getElementById(item).checked = false;

    errorMessage.innerHTML = ' - Limit 3';

    return Object.assign(errorMessage.style, {
      color: 'red',
    })
  }

  errorMessage.innerHTML = '';

  if (selectedProfessions.includes(item)) {
    const index = selectedProfessions.indexOf(item);
    selectedProfessions.splice(index, 1);
  } else {
    selectedProfessions.push(item)
  }

  renderProfessions(selectedProfessions);
}

const renderCheckedProfessions = () => {
  document.querySelectorAll('.profession-input').forEach(option => {
    if (selectedProfessions.includes(option.id)) {
      option.checked = true;
    }
  });
}

const renderProfessions = selectedProfessions => {
  const professionOptionsHTML = [];
  let filteredProfessionsList = professionsList;

  selectedProfessions.map(selectedProfession => {
    const selectedProfessionIndex = professionsList.indexOf(selectedProfession);
    if (selectedProfessionIndex > -1) {
      filteredProfessionsList = filteredProfessionsList.filter(item => item !== selectedProfession);
    }
  })

  const professions = [...selectedProfessions, ...filteredProfessionsList];

  professions.map(item => professionOptionsHTML.push(`
    <label class='label' for='${item}'>
      <span>${item}</span>
      <input class='profession-input' onclick='handleProfessionsClick("${item}")' type='checkbox' id='${item}'>
    </label>
  `));

  const professionsOptions = document.getElementById('professions-list');

  professionsOptions.innerHTML = professionOptionsHTML.join('');

  renderCheckedProfessions();
}

(() => {
  renderProfessions(selectedProfessions);

  const professionInput = document.querySelector('#professionInput');

  const getAllProfessions = userInput => {
    const filteredResults = professionsList.filter(
      element => element.toLowerCase().indexOf(userInput) > -1
    );

    return filteredResults;
  };

  professionInput.addEventListener(
    'input',
    debounce(async event => {
      const userInput = event.target.value.toLowerCase().trim();
      if (!userInput) {
        renderProfessions(selectedProfessions);
        return false;
      }

      const results = getAllProfessions(userInput);
      renderProfessions(results, selectedProfessions);
    }, 250)
  );
})();
