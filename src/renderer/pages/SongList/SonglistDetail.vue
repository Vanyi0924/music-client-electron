<template>
  <div class="songlist-detail px-16">
    <div class="header flex">
      <img
        :src="curSonglist?.cover"
        class="rou rounded-lg"
        width="220"
        height="220"
        alt=""
      />
      <div class="mt-12 flex-auto pl-4">
        <p class="text-center text-[30px] text-white">
          {{ curSonglist?.description }}
        </p>
        <p class="text-right text-13 text-white/75">
          —— {{ curSonglist?.updatedAt }}
        </p>
      </div>
    </div>
    <div>
      <p class="my-2 text-right text-white">共{{ songs.length }}首歌曲</p>
      <CommonSongList class="songlist" :list="songs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue";
import { api } from "@/api";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores";
import CommonSongList from "@/components/biz/CommonSongList.vue";
import { Api } from "@music/common";

const route = useRoute();

const appStore = useAppStore();

const curSonglist = computed(() => appStore.curSonglist);

const songs = ref<SongDetail[]>([]);

const getSongs = async () => {
  const { data } = await Api.getSonglistSongs({
    songlistId: Number(route.query.id),
  });

  songs.value = data;
};

watch(
  () => route.query.id,
  (newVal) => {
    newVal && getSongs();
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.songlist {
  :deep(.section-item-list) {
    padding: 0.5rem 1rem;
    .album-name {
      width: 12rem;
    }
    .singer-name {
      width: 10rem;
      text-align: right;
    }
  }
}
</style>
