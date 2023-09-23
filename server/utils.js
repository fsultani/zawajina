const fs = require('fs');

const invalidCharactersRegExp = /[<>]/;
const webLinksRegExp = /.*https?.*/i;
const htmlRegExp = /[&<>"'\/\n]/g;
const phoneNumberRegExp = /\d{6,}/;

/* Client-side utilities */
const rawInput = string => string
  .split(' ')
  .join('')
  .toLowerCase()
  .replace(/\./g, '')
  .replace(/,/g, '')
  .replace(htmlRegExp, '');

const checkForSocialMedia = string => {
  const originalString = string.toLowerCase().split('\n').join(' ').split(/[.\s:[&<>"'\/]+/);
  const arrayOfWords = [];

  for (index = 0; index < originalString.length; index++) {
    if (originalString[index].length === 1 && originalString[index + 1]?.length === 1) {
      arrayOfWords.push(originalString[index] + originalString[index + 1]);
      index++;
    } else {
      arrayOfWords.push(originalString[index]);
    }
  }

  const finalString = arrayOfWords.map(paragraph => paragraph.split(/[.\s:[&<>"'\/]+/))
    .flat()
    .map(word => word
      .replace(/\./g, '')
      .replace(/,/g, '')
      .replace(htmlRegExp, '')
    );

  return finalString;
}

const socialMediaAccounts = [
  'facebook',
  'whatsapp',
  'googlehangouts',
  'hangouts',
  'instagram',
  'snapchat',
  'viber',
  'telegram',
  'kakaotalk',
  'kik',
  '@',
];

const socialMediaTags = [
  'fb',
  'insta',
  'ig',
  'snap',
];

const htmlEscapeTags = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '\n': '<br>',
};

const escapeHtml = string => '' + string.replace(htmlRegExp, match => htmlEscapeTags[match]);
const inputHasSocialMediaAccount = string => socialMediaAccounts.some(item => rawInput(string).includes(item));
const inputHasSocialMediaTag = string => socialMediaTags.some(item => checkForSocialMedia(string).includes(item));
const inputHasPhoneNumber = string => phoneNumberRegExp.test(string);
const invalidString = string => invalidCharactersRegExp.test(string);
const preventWebLinks = string => webLinksRegExp.test(string);

/* Server-side utilities */
const getAllFiles = ({ directoryPath, fileType, filesArray }) => {
  const arrayOfFiles = [...filesArray];
  const getFiles = pathToFiles => {
    const directoryName = pathToFiles[0];
    pathToFiles.map(path => {
      const directoryFiles = fs.readdirSync(path);
      const subDirectories = directoryFiles.filter(item => !item.split('.')[1]);

      if (subDirectories.length > 0) {
        subDirectories.map(directory => {
          const newPath = [`${directoryName}/${directory}`]
          getFiles(newPath);
        })
      }

      directoryFiles.filter(file => file.split('.')[1] === fileType).map(file => {
        arrayOfFiles.push(`/static/${path}/${file}`);
      });
    })

    return arrayOfFiles;
  }

  const files = getFiles(directoryPath);

  return files;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const redirectToLogin = (error, res) => {
  console.log({ error });
  return res.redirect('/login');
}

const returnServerError = (res, error) => {
  console.log({ error });
  return res.sendStatus(500);
}

const badRequest = (req, res, message) => {
  const userId = req.body?.userId;
  console.log(`Errors`);
  console.table({ userId, message })
  return res.status(400).send({ message })
}

const verifyDate = date => date instanceof Date && !isNaN(date);

const camelCaseToTitleCase = string => string.charAt(0).toUpperCase() + string.replace(/([A-Z])/g, ' $1').slice(1)

module.exports = {
  badRequest,
  camelCaseToTitleCase,
  escapeHtml,
  getAllFiles,
  inputHasPhoneNumber,
  inputHasSocialMediaAccount,
  inputHasSocialMediaTag,
  invalidString,
  preventWebLinks,
  sleep,
  socialMediaAccounts,
  socialMediaTags,
  redirectToLogin,
  returnServerError,
  verifyDate,
};
