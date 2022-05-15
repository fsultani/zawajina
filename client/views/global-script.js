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

(() => {
  const myMatchDisplayToast = localStorage.getItem('my_match_display_toast');

  if (myMatchDisplayToast) {
    const toastData = JSON.parse(myMatchDisplayToast);

    setTimeout(() => {
      const toastElement = document.querySelector('.toast');
      const toastMessage = document.querySelector('.toast-message');
  
      toastElement.classList.add('show-toast');
      toastElement.classList.add('toast-success');
  
      if (toastData.type === 'success') {
        toastElement.classList.add('toast-success');
      } else (
        toastElement.classList.add('toast-error')
      )
  
      toastMessage.innerHTML = toastData.message;
  
      setTimeout(() => {
        toastElement.classList.remove('show-toast');
        localStorage.removeItem('my_match_display_toast');
      }, 3000)
    })
  }

  const lowerCaseString = string => string.split(' ').join('').toLowerCase();

  const toast = (type, message) => {
    localStorage.setItem('my_match_display_toast', JSON.stringify({ type, message }));
    location.reload();
  }

  if (typeof globalThis === 'object') {
    return globalThis = {
      lowerCaseString,
      toast,
    }
  }

  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this;
    },
    configurable: true // This makes it possible to `delete` the getter later.
  });
  __magic__.globalThis = __magic__; // lolwat
  delete Object.prototype.__magic__;
})();

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
