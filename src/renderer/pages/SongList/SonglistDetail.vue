<template>
  <div class="songlist-detail">
    <div class="header flex">
      <a-image
        :src="curSonglist?.cover"
        class="rou rounded-2xl"
        :width="220"
        :height="220"
        :preview="false"
        :placeholder="true"
        :alt="curSonglist?.description"
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
      <a-spin :spinning="spinning" :delay="200">
        <CommonSongList class="songlist" :list="songs" />
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores";
import CommonSongList from "@/components/biz/CommonSongList.vue";
import { Api } from "@music/common";
import { withCache } from "@/utils/app-cache";
import router from "@/router";

const route = useRoute();

const appStore = useAppStore();

const curSonglist = computed(() => appStore.curSonglist);

const songs = ref<SongDetail[]>([]);

const spinning = ref(false);

const getSongs = async () => {
  spinning.value = true;
  const { data } = await withCache<ReturnType<typeof Api.getSonglistSongs>>(
    Api.getSonglistSongs,
    {
      songlistId: Number(route.query.id),
    }
  );

  spinning.value = false;

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

onMounted(() => {
  console.log("detail onMounted");
});

const remove = router.afterEach((to, from, failure) => {
  if (from.path === "/songlist/detail") {
    songs.value = [];
  }
});

onUnmounted(() => {
  remove();
  console.log("detail onUnmounted");
});
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
