/*
node server/queries/apiCalls/deleteAllFromCloudinary.js
*/

require('dotenv').config();
const cloudinary = require("cloudinary");

require('../../config/cloudinary');

(async () => {
  if (process.env.NODE_ENV === 'development') {
    await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
      if (resourcesError) return resourcesError;
      if (resourcesResults.resources.length > 0) {
        resourcesResults.resources
          .filter(item => item.folder.startsWith(`${process.env.NODE_ENV}/`))
          .map(item => {
            console.log(`item - server/queries/puppeteer/create-farids-user.js:41\n`, item);
            cloudinary.v2.uploader.destroy(item.public_id, function (destroyError, destroyResult) {
              if (destroyError) return console.log('destroyError:\n', destroyError);
              console.log('destroyResult:\n', destroyResult);
            });
          });
      }
    });

    await cloudinary.v2.api.root_folders(async (root_foldersError, root_foldersResults) => {
      if (root_foldersError) return root_foldersError;
      if (root_foldersResults.folders.length > 0) {
        root_foldersResults.folders
          .filter(item => item.name === process.env.NODE_ENV)
          .map(folder => {
            console.log(`folder - server/queries/puppeteer/create-farids-user.js:54\n`, folder);
            cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
              if (error) return console.log('error:\n', error);
              console.log('result:\n', result);
            });
          });
      }
    });
  }
})();
