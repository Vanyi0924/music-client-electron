<template>
  <div class="song-list px-4">
    <!-- <div
      class="loading absolute left-0 top-0 flex h-full w-full items-center justify-center bg-app-dark-color-200"
    > -->
    <a-spin :spinning="spinning" :delay="200">
      <ul class="grid grid-cols-3 gap-4">
        <li
          v-for="sl in songlist"
          :key="sl.id"
          class="w-full cursor-pointer"
          @click="gotoDetail(sl)"
        >
          <a-image
            class="aspect-[1] w-full rounded-2xl"
            :preview="false"
            :src="sl.cover"
            :placeholder="true"
            :alt="sl.description"
          />

          <p class="sm:text-md m-1 break-words text-xs text-white">
            {{ sl.description }}
          </p>
        </li>
      </ul>
    </a-spin>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { Api } from "@/http";
import { useAppStore } from "@/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { withCache } from "@/utils/app-cache";
import { UniqueKeys } from "@/enums/UniqueKeys";
import { Songlist } from "@/http/typings";

const appStore = useAppStore();

const songlist = ref<Songlist[]>([]);

const spinning = ref(false);

const getSonglist = async () => {
  spinning.value = true;
  const { data } = await withCache<ReturnType<typeof Api.getSonglistPage>>({
    key: UniqueKeys.SONGLIST,
    fn: Api.getSonglistPage,
  });
  spinning.value = false;

  songlist.value = data.records.map((r) => {
    return r;
  });
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
  // display: grid;
  // grid-template-columns: repeat(5, 1fr);
  // gap: 24px;
  // min-height: 100vh;
}
</style>
