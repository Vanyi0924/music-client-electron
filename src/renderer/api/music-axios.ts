// export const createHttp = () => {
//   return {
//     get: () => {},
//   };
// };

import axios, {
  Axios,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

interface BizResponse<T = any> {
  code: string;
  data: T;
  msg: string;
}

class MusicAxios {
  // get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  axios: AxiosInstance;

  constructor(config?: CreateAxiosDefaults<any>) {
    this.axios = axios.create(config);

    this.axios.interceptors.response.use(
      function (response) {
        return response.data;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.axios.get<any, BizResponse<T>, D>(url, config);
  }
}

// const baseDomain = "http://rb.vanyi.top:10935/api";
const baseDomain = "http://127.0.0.1:8081/api";

export const baseURL = `${baseDomain}`;

export const http = new MusicAxios({
  baseURL,
});
