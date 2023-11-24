<template>
  <div class="songlist-detail">
    <div class="header mt-4 sm:flex">
      <div class="w-full sm:w-[220px]">
        <a-image
          :src="curSonglist?.cover"
          class="sm:rounded-2xl"
          width="100%"
          :preview="false"
          :placeholder="true"
          :alt="curSonglist?.description"
        />
      </div>
      <div class="mt-6 flex-auto pl-4 sm:mt-12">
        <p class="text-[26px] text-white sm:text-center sm:text-[30px]">
          {{ curSonglist?.description }}
        </p>
        <p class="mt-4 hidden pr-4 text-right text-13 text-white/75 sm:block">
          —— {{ curSonglist?.updatedAt }}
        </p>
      </div>
    </div>
    <div class="w-full">
      <p class="my-2 pr-4 text-right text-xs text-white opacity-75">
        共
        <strong class="font-bold text-app-sub-color">{{ songs.length }}</strong>
        首歌曲
      </p>
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
import { Api } from "@/http";
import { withCache } from "@/utils/app-cache";
import router from "@/router";
import { UniqueKeys } from "@/enums/UniqueKeys";
import { SongDetail } from "@/typing";
import { setSongFavoriteState } from "@/utils/index-biz";

const route = useRoute();

const appStore = useAppStore();

const curSonglist = computed(() => appStore.curSonglist);

const songs = ref<SongDetail[]>([]);

const spinning = ref(false);

const getSongs = async () => {
  spinning.value = true;
  const { data } = await withCache<ReturnType<typeof Api.getSonglistSongs>>({
    key: UniqueKeys.SONGLIST_DETAIL,
    fn: Api.getSonglistSongs,
    params: [
      {
        songlistId: Number(route.query.id),
      },
    ],
  });

  spinning.value = false;

  songs.value = data.map((d) => {
    return setSongFavoriteState(d);
  });
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
  // :deep(.section-item-list) {
  //   padding: 0.5rem 1rem;
  //   .album-name {
  //     width: 12rem;
  //   }
  //   .singer-name {
  //     width: 10rem;
  //     text-align: right;
  //   }
  // }
}
</style>
