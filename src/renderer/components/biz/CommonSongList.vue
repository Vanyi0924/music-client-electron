<template>
  <CommonList :list="list" @dblclick="(s: SongDetail)=> appStore.handlePlay(s)">
    <template
      #default="{ data: song, index }: { data: SongDetail, index: number }"
    >
      <span class="mr-2 w-4 text-right text-white">
        {{ paddingStrStart(String(index)) }}
      </span>

      <div
        class="mx-2 flex h-4 w-4 cursor-pointer items-center justify-center"
        @click="handleFavorite(song)"
      >
        <HeartFilled class="text-[14px] text-red" />
        <!-- <HeartOutlined /> -->
      </div>
      <p class="ellipsis name flex-auto">
        {{ song.name }}
      </p>
      <span class="ellipsis album-name w-20 pr-1 opacity-80">
        {{ song.albumName }}
      </span>
      <span class="ellipsis singer-name w-20 pr-2 opacity-60">
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
import { addFavorite } from "@/http/api";
import { paddingStrStart } from "@/utils";

const appStore = useAppStore();
defineProps<{ list: SongDetail[] }>();

const handleFavorite = (song: SongDetail) => {
  message.success("已收藏！");
  addFavorite(song.id);
};
</script>

<style lang="less" scoped>
.ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap text-white;
}
</style>
