export interface Page<T = any> {
  total: number;
  records: T[];
}
export interface Songlist {
  id: number;
  userId: number | null;
  type: number | null;
  cover: string;
  description: string;
  createdAt: string | null;
  updatedAt: string;
}

export interface BizResponse<T = any> {
  code: string;
  data: T;
  msg: string;
}

export interface SongDetail {
  id: number;
  name: string;
  singerName: string;
  albumName: string;
  albumId: number;
  duration: number;
  url: string;
  lyric: { lyric: string; time: string }[];
}

export interface AlbumDetail {
  id: number;
  name: string;
  singerName: string;
  picUrl: string;
  description: string;
}
