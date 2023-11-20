import { BkSongDetail } from "./http/typings";

export interface SongDetail extends BkSongDetail {
  _hasFavorite: boolean;
}

export interface PerLyric {
  time: number; // 秒为单位
  lineLyric: string;
  active: boolean;
}
