// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getUserIPAddress = async () => {
  try {
    if (window.location.origin.startsWith('http://localhost')) return '98.148.238.157';
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error(error);
    return reject('No user IP Address available');
  }
};

const CheckIPAddress = async () => {
  checkIPAddress = true;

  try {
    let userIPAddress = Cookies.get('my_match_token');
    if (!userIPAddress) userIPAddress = await getUserIPAddress();

    const response = await axios.get('/api/check-ip', {
      headers: {
        userIPAddress,
      }
    })

    const responseData = response.data.data;
    if (responseData) Cookies.set('my_match_token', responseData);
  } catch (error) {
    if (error.response?.data.isJWTError) {
      Cookies.remove('my_match_token');
      CheckIPAddress();
    }
  }
}

let checkIPAddress = false;
const Axios = async ({
  method = 'get',
  apiUrl,
  params,
}) => {
  try {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.response.use(response => {
      const redirectUrl = response.data?.redirectUrl;
      if (redirectUrl) return window.location.pathname = redirectUrl;
      return response;
    })

    if (!checkIPAddress) CheckIPAddress();

    if (method === 'get') {
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } else if (method === 'post') {
      const response = await axiosInstance.post(apiUrl, params);
      return response;
    } else if (method === 'put') {
      const response = await axiosInstance.put(apiUrl, params);
      return response;
    }
  } catch (error) {
    if (error.response?.status === 401 && window.location.pathname !== '/login') return window.location.pathname = '/login';

    throw error;
  }
};
