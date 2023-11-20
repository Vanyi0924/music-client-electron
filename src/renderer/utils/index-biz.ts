import { BkSongDetail } from "@/http/typings";
import { useAppStore } from "@/stores";
import { SongDetail } from "@/typing";

const appStore = useAppStore();

/**
 * @description 标记歌曲是否已收藏
 */
export const setSongFavoriteState = (
  song: SongDetail | BkSongDetail
): SongDetail => {
  return {
    ...song,
    _hasFavorite: appStore.favoriteSongs.has(String(song.id)),
  };
};
