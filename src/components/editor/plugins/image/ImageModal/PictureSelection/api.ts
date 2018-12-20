import {default as axios} from 'axios';

import qs from 'qs';

const network = axios.create({
  baseURL: '//mp.toutiao.com/',
  timeout: 10000,
  withCredentials: true,
  transformRequest: [function (data, post) {
    if (post['Content-Type'] === undefined) {
      return qs.stringify(data, { arrayFormat: 'brackets' });
    } else {
      return data;
    }
  }]
})


network.interceptors.response.use(response => {
  const { data } = response;
  return data;
})

network.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

export default network;
