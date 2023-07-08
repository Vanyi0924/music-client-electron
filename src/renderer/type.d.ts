interface SongParams {
  id: number;
  name: string;
}

interface SearchSongRes {
  songs: SongParams[];
  artists: { id: number; name: string; alias: string }[];
  albums: { id: number; name: string; description: string }[];
}

interface SongDetail {
  id: number;
  name: string;
  singerName: string;
  albumName: string;
  albumId: number;
  duration: number;
  url: string;
  lyric: { lyric: string; time: string }[];
}

interface AISongDetail {
  id: number;
  album_id: string;
  name: string;
  singer_name: string;
  album_name: string;
  is_in_database: boolean;
}

interface AlbumDetail {
  id: number;
  name: string;
  singerName: string;
  picUrl: string;
  description: string;
}

// interface SongDetail {
//   id: number;
//   name: string;
//   url: string;
//   lyric: string;
//   album: {
//     id: number;
//     name: string;
//     picUrl: string;
//     desc: string;
//   };
//   artists: {
//     id: number;
//     name: string;
//     alias: string;
//   }[]
// }

interface PerLyric {
  time: number; // 秒为单位
  lineLyric: string;
  active: boolean;
}

interface SonglistRes {
  records: Songlist[];
  total: number;
}
