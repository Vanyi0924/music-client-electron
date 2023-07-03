<template>
  <CommonList :list="list" @dblclick="(s: SongDetail)=> appStore.handlePlay(s)">
    <template #default="{ data: song }: { data: SongDetail }">
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

const appStore = useAppStore();
defineProps<{ list: SongDetail[] }>();
</script>

<style lang="less" scoped>
.ellipsis {
  @apply overflow-hidden text-ellipsis whitespace-nowrap text-white;
}
</style>
