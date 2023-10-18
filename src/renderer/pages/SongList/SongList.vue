<template>
  <div class="song-list">
    <!-- <div
      class="loading absolute left-0 top-0 flex h-full w-full items-center justify-center bg-app-dark-color-200"
    > -->
    <a-spin :spinning="spinning" :delay="200">
      <ul class="list flex flex-wrap">
        <li
          v-for="sl in songlist"
          :key="sl.id"
          class="cursor-pointer"
          @click="gotoDetail(sl)"
        >
          <a-image
            class="rounded-2xl"
            :preview="false"
            :src="sl.cover"
            :placeholder="true"
            :alt="sl.description"
          />

          <p class="text text-md m-1 break-words text-white">
            {{ sl.description }}
          </p>
        </li>
      </ul>
    </a-spin>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { Api } from "@music/common";
import { useAppStore } from "@/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { BizResponse, Page, Songlist } from "@music/common/types/typings";
import { withCache } from "@/utils/app-cache";

const appStore = useAppStore();

const songlist = ref<Songlist[]>([]);

const spinning = ref(false);

const getSonglist = async () => {
  spinning.value = true;
  const { data } = await withCache<ReturnType<typeof Api.getSonglistPage>>(
    Api.getSonglistPage
  );
  spinning.value = false;

  songlist.value = data.records.map((r) => {
    return r;
  });
};

const handlePlay = async (song: SongDetail) => {
  appStore.handlePlay(song);
};

onMounted(() => {
  getSonglist();
});

const router = useRouter();

const gotoDetail = (songlist: Songlist) => {
  appStore.curSonglist = songlist;
  router.push({ path: `songlist/detail`, query: { id: songlist.id } });
};
</script>

<style lang="less" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  min-height: 100vh;
}
</style>
