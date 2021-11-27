const debounce = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
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
