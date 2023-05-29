<template>
  <CommonList :list="list" @dblclick="(s: SongDetail)=> appStore.handlePlay(s)">
    <template #default="{ data: song }: { data: SongDetail }">
      <p class="flex-auto overflow-hidden text-ellipsis whitespace-nowrap">
        {{ song.name }}
      </p>
      <span
        class="w-20 overflow-hidden text-ellipsis whitespace-nowrap pr-1 opacity-80"
      >
        {{ song.albumName }}
      </span>
      <span
        class="w-20 overflow-hidden text-ellipsis whitespace-nowrap pr-2 opacity-60"
      >
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
defineProps<{ list: any[] }>();
</script>

<style lang="less" scoped></style>
