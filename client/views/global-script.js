let interval;
const debounce = (callback, time) => {
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback(...args);
    }, time);
  };
};

const FetchData = async (apiUrl, params) => {
  try {
    const response = await axios.get(apiUrl, params);
    return response.data;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

const getUserIPAddress = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (err) {
    console.error(err);
    return err;
  }
};

setTimeout(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  // Display slow network message for non Safari users after 5 seconds
  if (connection) {
    const type = connection.effectiveType;
    if (type === '2g' || type === '3g') {
      document.querySelector('#slow-network-warning').style.display = 'block';
    }
  }
}, 1000);
