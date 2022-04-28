const emailBodyContainerStyles = `
  width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  padding: 30px;
  margin-top: 50px;
  border-radius: 6px;
`;

const emailHeader = ({ recipientName }) => (`
  <p
    style="
      padding: 0 0 8px 0;
      margin-bottom: 8px;
      border-bottom: solid 1px #cccccc;
    "
  >
    As-salāmu ʿalaykum ${recipientName},
  </p>
`);

const paragraphStyles = ({ customStyles = '' }) => `
  padding: 0;
  margin: 0;
  ${customStyles}
`;

const paragraphFooterStyles = ({ customStyles = '' }) => `
  padding: 0;
  margin: 4px 0;
  ${customStyles}
`;

const spanStyles = ({ customStyles = '' }) => `
  font-weight: 700;
  ${customStyles}
`;

const ctaButton = ({ ctaButtonUrl, ctaButtonText, customStyles = '' }) => (`
  <a href=${ctaButtonUrl}
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-weight: 400;
      text-decoration: none;
      font-size: 14px;
      padding: 10px 24px;
      background-color: #007bff;
      border-radius: 12px;
      width: 130px;
      margin: 16px 0;
      ${customStyles}
    "
  >
    ${ctaButtonText}
  </a>
`);

const emailSignature = `
  <p style="padding: 0; margin: 0;">Jazāk Allāhu Khayr,</p>
  <p style="padding: 0; margin: 0;">Your My Match team</p>
`;

module.exports = {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  paragraphFooterStyles,
  spanStyles,
  ctaButton,
  emailSignature,
};
