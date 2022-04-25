const fs = require('fs');
const axios = require('axios');

/* Read all files of a given type without needing to add them manually to the res.render() function */
const getAllFiles = ({ directoryPath, fileType, filesArray }) => {
  directoryPath.map(dirPath => {
    const directoryFiles = fs.readdirSync(dirPath);
  
    directoryFiles.filter(file => file.split('.')[1] === fileType).map(file => {
      filesArray.push(`/static/${dirPath}/${file}`);
    });
  })

  return filesArray;
}

const FetchData = async (apiUrl, params = {}) => {
  try {
    const response = await axios.get(apiUrl, params);
    return response.data;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

module.exports = {
  getAllFiles,
  FetchData,
};
