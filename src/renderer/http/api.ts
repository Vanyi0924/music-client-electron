import { CreateAxiosDefaults } from "axios";
import { AlbumDetail, Page, SongDetail, Songlist } from "./typings";
import { MusicAxios } from "./music-axios";

export let http: MusicAxios;

export const initHttp = (config?: CreateAxiosDefaults<any> | undefined) => {
  http = new MusicAxios(config);
};

const addPrefix = (path: string, prefix: string) => `${prefix}${path}`;

const addMusicPrefix = (path: string) => addPrefix(path, "/music");
const addCaptchaPrefix = (path: string) => addPrefix(path, "/captcha");
const addFavoritePrefix = (path: string) =>
  addMusicPrefix(addPrefix(path, "/favorite"));

/**
 * @description 分页获取歌单
 **/
export const getSonglistPage = (pageSize = 35) =>
  http.get<Page<Songlist>>(addMusicPrefix("/songlist/page-query"), {
    params: {
      pageSize,
    },
  });

/**
 * @description: 获取歌单下所有歌曲
 */
export const getSonglistSongs = (params: { songlistId: number }) =>
  http.get<SongDetail[]>(addMusicPrefix(`/songlist/songs`), {
    params,
  });

/**
 * @description: 专辑详情
 */
export const getAlbumDetailApi = (id: number) =>
  http.get<AlbumDetail>(addMusicPrefix("/album/detail"), {
    params: {
      id,
    },
  });

/**
 * @description: 搜索歌曲
 */
export const searchSongs = (keyword: string, pageNo = 1, pageSize = 10) =>
  http.get<Page<SongDetail>>(addMusicPrefix("/song/search"), {
    params: {
      keyword,
      pageNo,
      pageSize,
    },
  });

/**
 * @description: 注册
 */
export const register = (email: string, code: string) =>
  http.post<any>(addMusicPrefix("/register"), {
    email,
    code,
  });

/**
 * @description: 登录
 */
export const login = (email: string, password: string) =>
  http.post<any>(addMusicPrefix("/login"), {
    email,
    password,
  });

/**
 * @description: 登出
 */
export const logout = () => http.del<any>(addMusicPrefix("/logout"));

/**
 * @description: 获取邮箱验证码
 */
export const getEmailCaptcha = (email: string) =>
  http.get(addCaptchaPrefix("/email"), {
    params: {
      email,
    },
  });

/**
 * @description: 收藏歌曲
 */
export const addFavorite = (songId: string) =>
  http.put<any>(addMusicPrefix(`/favorite/add/${songId}`));

/**
 * @description: 取消收藏歌曲
 */
export const removeFavorite = (songId: string) =>
  http.put<any>(addMusicPrefix(`/favorite/remove/${songId}`));

/**
 * @description 是否登录
 */
export const isLogin = () => http.get<boolean>(addMusicPrefix("/isLogin"));

/**
 * @description: 收藏歌曲
 */
export const getExistFavorite = () =>
  http.get<
    {
      id: number;
      userId: number;
      songId: number;
    }[]
  >(addFavoritePrefix("/exist"));

/**
 * @description:
 */
export const getStream = () =>
  http.get(addMusicPrefix("/test/stream"), {
    responseType: "blob",
  });
