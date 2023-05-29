<template>
  <div class="song-list">
    <ul class="p-4">
      <li
        v-for="(sl, index) in songList"
        :key="sl.id"
        class="index-wrapper my-1.5 flex h-20 cursor-pointer rounded-lg py-3 text-slate-100 transition-all duration-300 hover:bg-black/10"
        @dblclick="handlePlay(sl)"
      >
        <div class="flex w-16 justify-center text-center text-sm opacity-75">
          <i class="index not-italic">
            {{ index + 1 }}
          </i>
          <div class="mt-1">
            <m-icon
              v-if="appState.songDetail?.id === sl.id && appState.isPlaying"
              class="play-icon"
              :width="15"
            >
              <PauseRoundIcon />
            </m-icon>
            <m-icon v-else class="play-icon" :width="15">
              <PlayIcon />
            </m-icon>
          </div>
        </div>

        <div class="flex-auto">
          <p>{{ sl.name }}</p>
          <p class="text-sm opacity-75">{{ sl.singerName }}</p>
        </div>
        <p class="w-40 text-sm opacity-75">{{ sl.albumName }}</p>
        <span class="w-20 text-sm opacity-75">
          <!-- {{ "88:88" }} -->
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getSonglistApi, baseURL, getAlbumDetailApi } from "@/api/http";
import { useAppStore } from "@/stores";
import { onMounted, ref } from "vue";
import PlayIcon from "@/assets/icons/vue/Play.vue";
import PauseRoundIcon from "@/assets/icons/vue/PauseRound.vue";

const appStore = useAppStore();

const songList = ref<SongDetail[]>([]);

const appState = useAppStore();

const getSonglist = async () => {
  const { data } = await getSonglistApi();
  songList.value = data.rows;
};

const handlePlay = async (song: SongDetail) => {
  appStore.handlePlay(song);
};

onMounted(() => {
  getSonglist();
});
</script>

<style lang="css" scoped>
.play-icon {
  display: none;
}

.index {
  display: block;
}
.index-wrapper:hover .play-icon {
  display: block;
}

.index-wrapper:hover .index {
  display: none;
}
</style>
