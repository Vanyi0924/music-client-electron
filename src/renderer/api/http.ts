import axios, { AxiosInstance } from "axios";
import { Api } from "@music/common";

const baseDomain = "http://127.0.0.1:8081/api";
// const baseDomain = "http://rb.vanyi.top:10926";

export const baseURL = `${baseDomain}`;
export const SSObaseURL = `${baseDomain}/api/music/static`;
export const baseURLAI = `http://127.0.0.1:10933/api`;
// export const baseURLAI = `${baseDomain}/api/ai`;

const httpAI = axios.create({
  baseURL: baseURLAI,
});

const responseInterceptor = (http: AxiosInstance) => {
  http.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response.data;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
};

responseInterceptor(httpAI);

interface BizResponse<T = any> {
  code: string;
  data: T;
  msg: string;
}

export const apiSongDetail = (params: { id: number; type: number }) =>
  http.get("/song/detail", {
    params,
  });

export const apiSongSearch = (params: { keywords: string }) =>
  http.get("/song/search", {
    params,
  });

export const apiPlaylist = () => http.get("/playlist");

/**
 * @description: 分页 获取歌单
 */
export const getSonglistPage = (params?: {
  pageNo?: number;
  pageSize?: number;
}) =>
  http.get<SonglistRes>("/songlist/page-query", {
    params,
  });

export interface AISearchRes {
  total: number;
  rows: AISongDetail[];
}
export const getAISearchApi = (keywords: string, pageNo?: number) =>
  httpAI.get<any, BizResponse<AISearchRes>>("/search", {
    params: {
      keywords,
      pageNo,
    },
  });

export const getAISongDetailApi = (id: number) =>
  httpAI.get<any, BizResponse<any>>(`/songDetail/${id}`);

/**
 * @description: 根据三个名称获取歌曲
 */
export const getSongDetailByNameApi = (params: {
  artistName: string;
  albumName: string;
  songName: string;
}) =>
  http.get<any, BizResponse<any>>(`/song/detailByName`, {
    params,
  });
