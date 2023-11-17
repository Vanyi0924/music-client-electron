import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from "axios";
import { BizResponse } from "./typings";

export class MusicAxios {
  axios: AxiosInstance;

  constructor(config?: CreateAxiosDefaults<any>) {
    this.axios = axios.create(config);
  }

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.axios.get<any, BizResponse<T>, D>(url, config);
  }

  del<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.axios.delete<any, BizResponse<T>, D>(url, config);
  }

  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) {
    return this.axios.post<any, BizResponse<T>, D>(url, data, config);
  }

  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.axios.put<any, BizResponse<T>, D>(url, data, config);
  }
}
