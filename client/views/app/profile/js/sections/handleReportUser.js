const modal = getQuerySelector('.modal');

const handleReportUser = () => {
  Object.assign(modal.style, {
    display: 'block',
    position: 'absolute',
    zIndex: 1,
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  });

  const modalContent = getQuerySelector('.modal-content');
  Object.assign(modalContent.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '20px 30px',
    width: '350px',
    height: 'auto',
    position: 'relative',
    top: '300px',
    borderRadius: '8px',
    animation: '0.5s ease 0s 1 normal none running animation-show-modal',
  });

  const settingsForm = getQuerySelector('.modal-form');
  Object.assign(settingsForm.style, {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }); 

  const reportUserHeader = getQuerySelector('.modal-header');
  reportUserHeader.innerHTML = `Report`;
  Object.assign(reportUserHeader.style, {
    width: '100%',
    borderBottom: '1px solid #adadad',
    textAlign: 'center',
    paddingBottom: '5px',
  });
  
  const modalBody = getQuerySelector('.modal-body'); 
  modalBody.innerHTML = `
    <section class='report-user-section'>
      <p class='report-user-section-subheader'>What's wrong with User?</p>
      <div class='radio-wrapper'>
        <input type='radio' name='report-user' class='radio-button' id='inappropriate-profile'
          value='Inappropriate profile'>
        <label for='inappropriate-profile' class='radio-label'>Inappropriate profile</label><br>
      </div>
      <div class='radio-wrapper'>
        <input type='radio' name='report-user' class='radio-button' id='abusive-or-threatening'
          value='Abusive or threatening'>
        <label for='abusive-or-threatening' class='radio-label'>Abusive or threatening</label><br>
      </div>
      <div class='radio-wrapper'>
        <input type='radio' name='report-user' class='radio-button' id='fake-profile-or-scammer'
          value='Fake profile or scammer'>
        <label for='fake-profile-or-scammer' class='radio-label'>Fake profile or scammer</label><br>
      </div>
    </section>

    <section class='additional-information-section'>
      <textarea class='additional-information' id='additional-information' name='additional-information'
        placeholder='Additional Information'></textarea>
    </section>
  `;

  Object.assign(modalBody.style, {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '25px 0',
    width: '100%',
  });

  const reportUserSectionHeader = getQuerySelector('.report-user-section-subheader');
  Object.assign(reportUserSectionHeader.style, {
    paddingBottom: '10px',
    width: '100%',
  });

  const radioWrapper = document.querySelectorAll('.radio-wrapper');
  radioWrapper.forEach((element, index) => {
    Object.assign(element.style, {
      display: 'flex',
      width: '100%',
      paddingTop: index > 0 ? '8px' : 0,
    });
  });

  const radioButton = document.querySelectorAll('.radio-button');
  radioButton.forEach(element => {
    Object.assign(element.style, {
      margin: 0,
      marginRight: '8px',
      width: 'auto',
      verticalAlign: 'top',
      backgroundColor: '#fff',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      border: '1px solid rgba(0,0,0,.25)',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      WebkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact'
    });
  });

  const radioLabel = document.querySelectorAll('.radio-label');
  radioLabel.forEach(element => {
    Object.assign(element.style, {
      margin: 0,
      width: 'auto',
      fontSize: '16px',
    });
  });

  const additionalInformationSection = getQuerySelector('.additional-information-section');
  Object.assign(additionalInformationSection.style, {
    width: '100%',
  });

  const additionalInformationElement = getQuerySelector('.additional-information');
  Object.assign(additionalInformationElement.style, {
    height: '100px',
  }); 
};

const handleSubmit = (event, userId) => {
  event.preventDefault();

  let selectedOption;
  document.getElementsByName('report-user').forEach(element => {
    if (element.checked) {
      selectedOption = element;
    }
  })

  const additionalInformation = getQuerySelector('#additional-information').value;

  displaySmallLoadingSpinner(true, '.report-user-modal-content', '.close-modal');

  Axios({
    method: 'put',
    apiUrl: '/api/user/report', // server/routes/user/api.js
    params: {
      userId,
      reason: selectedOption.value,
      additionalInformation,
    },
  })
    .then(({ data }) => {
      const { message } = data;
      toast('success', message);
      modal.style.display = 'none';
      displaySmallLoadingSpinner(false, '.report-user-modal-content', '.close-modal');
    })
    .catch(() => {
      toast('error', 'There was an error');
      displaySmallLoadingSpinner(false, '.report-user-modal-content', '.close-modal');
    });
}
