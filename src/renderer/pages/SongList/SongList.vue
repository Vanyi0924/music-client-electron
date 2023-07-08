<template>
  <div class="song-list">
    <ul class="flex flex-wrap px-6">
      <li v-for="sl in songlist" :key="sl.id" @click="gotoDetail(sl)">
        <img class="rounded" :src="sl.cover" alt="" />
        <p class="text text-md m-1 break-words text-white">
          {{ sl.description }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Api } from "@music/common";
import { useAppStore } from "@/stores";
import { onMounted, ref } from "vue";
import PlayIcon from "@/assets/icons/vue/Play.vue";
import PauseRoundIcon from "@/assets/icons/vue/PauseRound.vue";
import { query } from "winston";
import { useRouter } from "vue-router";
import { MultipleCascaderProps } from "ant-design-vue/lib/vc-cascader/Cascader";
import { Songlist } from "@music/common/types/typings";

const appStore = useAppStore();

const songlist = ref<Songlist[]>([]);

const getSonglist = async () => {
  const { data } = await Api.getSonglistPage();
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
.song-list {
  > ul {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
    > li {
    }
  }
}
</style>
