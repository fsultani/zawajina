const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  emailSignature,
} = require('./components');

const emailVerification = ({ name }) => {
  const emailVerificationToken = Math.floor(Math.random() * 90000) + 10000;
  const subject = 'Thanks for signing up on My Match!';
  const emailBody = `
    <div style="${emailBodyContainerStyles}">
      ${emailHeader({ recipientName: name })}
      <p style="${paragraphStyles({})}">
        Thanks for signing up!
      </p>

      <p style="${paragraphStyles({
        customStyles: `padding: 10px 0;`
      })}">
        Please enter the following code to verify your email address: ${emailVerificationToken}
      </p>

      ${emailSignature}
    </div>
  `;

  return {
    emailVerificationToken,
    subject,
    emailBody,
  }
};

module.exports = emailVerification;
