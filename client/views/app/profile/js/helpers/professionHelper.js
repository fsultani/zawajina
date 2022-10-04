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

const professionHelper = () => {
  const professionOptions = ['<option selected disabled>Select Profession</option>'];
  professionsList.map(item => professionOptions.push(`<option>${item}</option>`));

  const profession = document.querySelector('#profession');
  profession.innerHTML = professionOptions;

  const professionValue = profession.getAttribute('data-profession');
  profession.selectedIndex = professionsList.indexOf(professionValue) + 1;
};
