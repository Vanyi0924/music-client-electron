import { message } from "ant-design-vue";
import { Api } from ".";
import electronConfig from "@/../../electron-vue.config";
import { ResponseCode } from "@/enums/ResponseCode";
import { useAccountStore } from "@/stores/account";

export const configApi = () => {
  const { renderer } = electronConfig();
  const accountStore = useAccountStore();

  Api.initHttp({
    baseURL: renderer.baseURL,
    timeout: 30000,
  });

  Api.http.axios.interceptors.request.use(
    function (config) {
      config.headers.token = `Bearer ${accountStore.user?.token}`;
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  Api.http.axios.interceptors.response.use(
    function (response) {
      console.log(response.config.url);

      if (response.config.url?.includes("/test/stream")) {
        return response;
      }

      if (response.data.code !== ResponseCode.SUCCESS) {
        message.error(response.data.msg);
      }
      return response.data;
    },
    function (error) {
      message.error(`【${error.name} - ${error.code}】${error.message}`);
      return;
      // return Promise.reject(error);
    }
  );
};
