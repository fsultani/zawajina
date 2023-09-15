const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  emailSignature,
  ctaButton,
} = require('./components');

const emailVerification = ({ name }) => {
  const emailVerificationToken = Math.floor(Math.random() * 90000) + 10000;

  const url = `${process.env.HOST_URL}/verify-email`;

  const subject = 'Thanks for signing up on Zawajina!';
  const emailBody = `
    <div style="${emailBodyContainerStyles}">
      ${emailHeader({ recipientName: name })}
      <p style="${paragraphStyles({})}">Thanks for signing up!</p>

      <p style="${paragraphStyles({ customStyles: `padding: 10px 0;` })}">
        Please enter the following code to verify your email address: ${emailVerificationToken}
      </p>

      ${ctaButton({ ctaButtonUrl: url, ctaButtonText: 'Verify Email' })}
      ${emailSignature}

      </div>
    </div>
  `;

  return {
    emailVerificationToken,
    subject,
    emailBody,
  }
};

module.exports = { emailVerification };
