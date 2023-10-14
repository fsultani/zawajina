const modal = getQuerySelector('.modal');

const handleReportUser = (memberId, memberName) => {
  const modalHeader = `What's wrong with ${memberName ?? 'this user'}?`;
  const modalBody = `
    <section class='report-user-section'>
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

  const modalButton = 'Submit';

  showModal({
    modalHeader,
    modalBody,
    modalButton,
    customStyles: [
      {
        element: '.modal-body',
        styles: {
          alignItems: 'flex-start',
        }
      },
      {
        element: '.modal-header',
        styles: {
          width: '100%',
          borderBottom: '1px solid #adadad',
          textAlign: 'center',
          paddingBottom: '5px',
        }
      },
      {
        element: '.radio-wrapper',
        styles: {
          display: 'flex',
          width: '100%',
          paddingTop: '8px',
        }
      },
      {
        element: '.radio-button',
        styles: {
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
        }
      },
      {
        element: '.radio-label',
        styles: {
          margin: 0,
          width: 'auto',
          fontSize: '16px',
        }
      },
      {
        element: '.additional-information-section',
        styles: {
          width: '100%',
        }
      },
      {
        element: '.additional-information',
        styles: {
          height: '100px',
        }
      },
    ],
    submitFormCallback: () => {
      let selectedOption;
      document.getElementsByName('report-user').forEach(element => {
        if (element.checked) {
          selectedOption = element;
        }
      })

      const additionalInformation = getQuerySelector('#additional-information').value;

      Axios({
        method: 'put',
        apiUrl: '/api/user/report', // server/routes/user/api.js
        params: {
          memberId,
          reason: selectedOption.value,
          additionalInformation,
        },
      })
        .then(({ data }) => {
          const { message } = data;
          toast('success', message);
        })
        .catch(() => {
          toast('error', 'There was an error');
          closeModal();
        })
        .finally(() => {
          closeModal();
          isSubmitting('modal-button-loading-spinner-wrapper', false);
        })
    },
  });
};
