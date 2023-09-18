(async () => {
  const referrer = document.referrer;
  if (referrer) {
    const isConversation = referrer.split('/').slice(-2, -1)[0] === 'messages';
    if (isConversation) {
      const conversationId = referrer.split('/').slice(-1)[0];
      axios.delete(`/messages/api/conversation/delete/${conversationId}`)
    }
  }

  const accountStatusElement = getQuerySelectorById('account-status');
  const accountStatusValue = accountStatusElement.dataset.accountStatus;

  if (accountStatusValue === 'banned') {
    const modalHeader = 'Account banned';
    const modalBody = '<h3>This account has been permanently banned for violating our Terms of Service.</h3>'
    const modalButton = 'Okay';

    return showModal({
      modalHeader,
      modalBody,
      modalButton,
      canCloseModal: false,
      submitFormCallback: () => {
        handleLogout();
      }
    });
  }

  if (accountStatusValue !== 'approved') {
    /* Calculate the height of the warning message to add appropriate padding to the page. */
    const bodyWrapper = getQuerySelector('.body-wrapper');
    const userFacingMessage = accountStatusElement.dataset.userFacingMessage || 'Account under review. You may still update your account information and password.';
    const numberOfBreaks = userFacingMessage.split('<br>').length - 1;

    /*
      55 is to match the height of the navbar.
      20 is for extra spacing.
    */
    const marginTop = numberOfBreaks > 0 ? `${55 + (numberOfBreaks * 40) + 20}px` : '115px';

    Object.assign(bodyWrapper.style, {
      marginTop,
    })

    accountStatusElement.innerHTML = `
      <div class='account-status'>
        <p class='account-status-message'>${userFacingMessage}</p>
      </div>
	 `;
  }
})();
