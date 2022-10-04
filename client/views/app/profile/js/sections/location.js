const getLocationData = async () => {
  const userIPAddress = await getUserIPAddress();
  const locationData = async () => {
    try {
      const data = await FetchData('/register/api/location', {
        params: {
          userIPAddress,
        },
      });
      return data;
    } catch (error) {
      console.log(`error\n`, error);
      document.querySelector('#application-error').style.display = 'block';
      return error.response;
    }
  };

  if (typeof globalThis === 'object') {
    const {
      allLocations,
      userLocationData,
    } = await locationData();

    return globalThis = {
      allLocations,
      userLocationData,
    }
  };

  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this;
    },
    configurable: true // This makes it possible to `delete` the getter later.
  });
  __magic__.globalThis = __magic__; // lolwat
  delete Object.prototype.__magic__;
}
