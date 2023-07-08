let userIP = window.location.origin === 'http://localhost:3000' ? '98.148.238.157' : undefined;

const getUserIPAddress = async () => {
  if (!userIP) {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      userIP = response.data.ip;
      return userIP;
    } catch (error) {
      console.error(error);
      return 'No user IP Address available';
    }
  }

  return userIP;
};

const Axios = async ({
  method = 'get',
  apiUrl,
  params,
}) => {
  try {
    const userIPAddress = await getUserIPAddress();

    const axiosInstance = axios.create({
      headers: {
        userIPAddress,
      }
    });

    axiosInstance.interceptors.response.use(response => {
      const redirectUrl = response.data?.redirectUrl;
      if (redirectUrl) return window.location.pathname = redirectUrl;
      return response;
    })

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
    if (error?.response?.status === 401 && window.location.pathname !== '/login') return window.location.pathname = '/login';

    throw error;
  }
};
