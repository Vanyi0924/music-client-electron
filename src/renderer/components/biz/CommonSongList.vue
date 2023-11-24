<template>
  <CommonList :list="list" @play="(s: SongDetail)=> appStore.handlePlay(s)">
    <template
      #default="{ data: song, index }: { data: SongDetail, index: number }"
    >
      <span class="index mr-2 w-4 text-right text-white">
        {{ paddingStrStart(String(index + 1)) }}
      </span>

      <div
        v-if="accountStore.isLogin"
        class="mx-2 flex h-4 w-4 cursor-pointer items-center justify-center"
        @click="handleFavorite(song)"
      >
        <HeartFilled v-if="song._hasFavorite" class="text-[14px] text-red" />
        <HeartOutlined v-else class="text-white" />
      </div>
      <p class="ellipsis name flex-auto">
        {{ song.name }}
      </p>
      <span class="ellipsis album-name w-20 pr-1 opacity-80">
        {{ song.albumName }}
      </span>
      <span class="ellipsis singer-name w-20 pr-2 text-right opacity-60">
        {{ song.singerName }}
      </span>
      <slot name="suffix" :song="song"></slot>
    </template>
  </CommonList>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CommonList from "../CommonList/CommonList.vue";
import { useAppStore } from "@/stores";
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { addFavorite, removeFavorite } from "@/http/api";
import { paddingStrStart } from "@/utils";
import { useAccountStore } from "@/stores/account";
import { SongDetail } from "@/typing";

const appStore = useAppStore();
defineProps<{ list?: SongDetail[] }>();

const accountStore = useAccountStore();

const handleFavorite = async (song: SongDetail) => {
  const playlistSong = appStore.playlist.find(
    (songDetail) => songDetail.id === song.id
  );
  if (song._hasFavorite) {
    song._hasFavorite = false;
    const { code } = await removeFavorite(song.id);
    playlistSong && (playlistSong._hasFavorite = false);
    message.success("已取消收藏！");
  } else {
    song._hasFavorite = true;
    const { code } = await addFavorite(song.id);
    playlistSong && (playlistSong._hasFavorite = true);
    message.success("收藏成功！");
  }

  if (playlistSong) {
    appStore.setPlaylist(appStore.playlist);
  }
  console.log(appStore.playlist);
};
</script>

<style lang="less" scoped>
.ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap text-white;
}
</style>
