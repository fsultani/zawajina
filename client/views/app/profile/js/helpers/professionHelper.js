const professionsList = [
  'Teacher',
  'Engineer',
  'Physician',
  'Lawyer',
  'Architect',
  'Scientist',
  'Pharmacist',
  'Accountant',
  'Veterinarian',
  'Dentist',
  'Worker',
  'Technician',
  'Artist',
  'Firefighter',
  'Electrician',
  'Actor',
  'Chef',
  'Plumber',
  'Police officer',
  'Psychologist',
  'Waiter',
  'Cook',
  'Mechanic',
  'Hairdresser',
  'Librarian',
  'Secretary',
  'Aircraft pilot',
  'Dietitian',
  'Registered nurse',
  'Occupational Therapist',
  'Designer',
  'Farmer',
  'Surgeon',
  'Cashier',
  'Butcher',
  'Optician',
  'Economist',
  'Mail carrier',
  'Dental hygienist',
  'Judge',
  'Geologist',
  'Tailor',
  'Journalist',
  'Cleaner',
  'Athlete',
  'Baker',
  'Lifeguard',
  'Other',
];

let profession;
const professionHelper = (professionValue) => {
  const professionOptionsHTML = [];
  professionsList.map(item => professionOptionsHTML.push(`<option>${item}</option>`));

  const professionOptions = document.querySelector('#profession');
  professionOptions.value = professionValue;
  profession = professionValue;

  professionOptions.innerHTML = professionOptionsHTML;
  professionOptions.selectedIndex = professionsList.indexOf(professionValue);
};

const handleProfession = event => profession = event.target.value;
