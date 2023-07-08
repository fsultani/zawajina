// const getLocationData = async () => {
//   const userIPAddress = await getUserIPAddress();
//   const locationData = async () => {
//     try {
//       const data = await Axios('/register/api/location', {
//         params: {
//           userIPAddress,
//         },
//       });
//       return data;
//     } catch (error) {
//       document.querySelector('#application-error').style.display = 'flex';
//       return error.response;
//     }
//   };

//   if (typeof globalThis === 'object') {
//     const {
//       allLocations,
//       userLocationData,
//     } = await locationData();

//     return globalThis = {
//       allLocations,
//       userLocationData,
//     }
//   };

//   Object.defineProperty(Object.prototype, '__magic__', {
//     get: function () {
//       return this;
//     },
//     configurable: true // This makes it possible to `delete` the getter later.
//   });
//   __magic__.globalThis = __magic__; // lolwat
//   delete Object.prototype.__magic__;
// }
