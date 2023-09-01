import { Api } from "@music/common";
import { PLAYLIST } from "@/config/constants";
import { nextSongIndex, PlayModel, SwitchSongDirection } from "@/utils";
import { defineStore } from "pinia";
import { Songlist } from "@music/common/types/typings";

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。

interface AppState {
  songSearchResultVisible: boolean;
  searchIsFocus: boolean;
  isPlaying: boolean;
  playingTimestamp: number; // 秒
  songDuration: number; // 秒
  keywords: string;
  audioEl?: HTMLAudioElement;
  songDetail?: SongDetail;
  albumDetail?: AlbumDetail;
  songDetailMap?: Map<string, AlbumDetail>;
  albumDetailMap: Map<number, AlbumDetail>;
  playlist: SongDetail[];
  showPlaylist: boolean;
  playModel: PlayModel;
  startPlayTs: number;
  curSonglist?: Songlist;
  currentPage: number;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => {
    const playlist = window.localStorage.getItem(PLAYLIST);

    return {
      songSearchResultVisible: false,
      searchIsFocus: false,
      isPlaying: false,
      playingTimestamp: 0,
      songDuration: 0,
      keywords: "",
      audioEl: undefined,
      songDetail: undefined,
      albumDetail: undefined,
      albumDetailMap: new Map(),
      songDetailMap: new Map(),
      playlist: playlist ? JSON.parse(playlist) : [],
      showPlaylist: false,
      playModel: PlayModel.loop,
      startPlayTs: Date.now(),
      currentPage: 1,
    };
  },
  getters: {
    songDetailURL: (state) =>
      state.songDetail?.url ? state.songDetail?.url : undefined,
  },
  actions: {
    /**
     * @description: 切换播放模式
     */
    setPlayModel() {
      // 单曲 列表 随机
      if (this.playModel === PlayModel.loop) {
        this.playModel = PlayModel.list;
      } else if (this.playModel === PlayModel.list) {
        this.playModel = PlayModel.random;
      } else {
        this.playModel = PlayModel.loop;
      }
    },
    /**
     * @description: 获取下一首播放
     */
    playNextSong(dir?: SwitchSongDirection) {
      if (!this.songDetail) {
        return;
      }
      const curIndex = this.getCurSongIndex();
      const nextIndex = nextSongIndex(
        this.playModel,
        curIndex,
        this.playlist.length,
        dir
      );
      if (nextIndex < 0) {
        this.handlePlay(this.songDetail);
      } else {
        this.handlePlay(this.playlist[nextIndex]);
      }
    },
    /**
     * @description: 获取在播放列表中的索引
     */
    getCurSongIndex() {
      return this.playlist.findIndex((p) => this.songDetail?.id === p.id);
    },
    /**
     * @description: 是否存在于播放列表中
     */
    removeExistInPlaylistItem(song: SongDetail) {
      const idx = this.playlist.findIndex((p) => p.id === song.id);

      if (idx !== -1) {
        this.playlist.splice(idx, 1);
        localStorage.setItem(PLAYLIST, JSON.stringify(this.playlist));
      }
    },
    /**
     * @description: 是否存在于播放列表中
     */
    isExistInPlaylist(song: SongDetail) {
      return this.playlist.find((p) => p.id === song.id);
    },
    /**
     * @description: 播放音乐
     */
    async handlePlay(song: SongDetail) {
      this.songDetail = song;
      this.startPlayTs = Date.now();
      await this.getAlbumDetail(song.albumId);
      // 存入播放列表
      if (!this.isExistInPlaylist(song)) {
        this.playlist.push(song);
        localStorage.setItem(PLAYLIST, JSON.stringify(this.playlist));
      }
    },
    async getAlbumDetail(id: number) {
      this.albumDetail = this.albumDetailMap.get(id);
      if (this.albumDetail) {
        return;
      }
      const { data } = await Api.getAlbumDetailApi(id);
      this.albumDetail = data;
      this.albumDetailMap.set(id, data);
    },
  },
});
