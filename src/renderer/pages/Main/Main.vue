<template>
  <main class="flex h-full flex-col bg-app-dark-color-200 text-gray-950">
    <CommonHeader
      ref="commonHeaderRef"
      @search-song-start="appStore.songSearchResultVisible = true"
      @search-song="onSearchSong"
    />

    <SongSearchResult
      v-model="appStore.songSearchResultVisible"
      :search-song-res="searchSongRes"
      :ai-search-song-res="aiSearchResult"
      @page-change="handlePageChange"
      @ai-search="handleAISearch"
      @ai-search-end="handleAiSearchEnd"
    />

    <!-- VIEW -->
    <div class="h-0 flex-auto overflow-auto">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <PlayerBar
      class="sticky bottom-0 left-0 flex w-full"
      :song-detail="songDetail"
      @action-play="onActionPlay"
    />
    <audio
      ref="audioRef"
      :src="appStore?.songDetailURL"
      @timeupdate="onTimeupdate"
      @durationchange="onDurationchange"
      @ended="onEnded"
    ></audio>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { AISearchRes, apiSongDetail, getAISearchApi } from "@/api/http";
import PlayerBar from "@/components/PlayerBar/PlayerBar.vue";
import SongSearchResult from "@/components/SongSearchResult/SongSearchResult.vue";
import { useAppStore } from "@/stores";
import { withEmptyValue } from "@/utils";
import CommonHeader from "@/components/CommonHeader/CommonHeader.vue";
import { useRoute, useRouter } from "vue-router";

const commonHeaderRef = ref<InstanceType<typeof CommonHeader>>();

const searchSongRes = ref<SonglistRes>();

const onSearchSong = (res: SonglistRes) => {
  searchSongRes.value = res;
};

const appStore = useAppStore();
const songDetail = computed(() => appStore.songDetail);

const play = () => {
  appStore.playingTimestamp = 0;
  audioRef.value!.currentTime = 0;
  appStore.isPlaying = true;
  audioRef.value?.play();
};

watch(
  () => appStore.startPlayTs,
  (newVal) => {
    console.log(newVal);

    if (audioRef.value) {
      if (audioRef.value.readyState === 4) {
        play();
      } else {
        audioRef.value.onloadeddata = () => {
          console.log("oncanplay");
          play();
        };
      }
    }
  }
);

const audioRef = ref<HTMLAudioElement>();

onMounted(() => {
  appStore.audioEl = audioRef.value;
});
const onActionPlay = () => {
  if (!songDetail.value) {
    return;
  }

  audioRef.value?.paused ? audioRef.value?.play() : audioRef.value?.pause();
  appStore.isPlaying = !audioRef.value?.paused;
};

const onTimeupdate = (ev: Event) => {
  appStore.playingTimestamp = withEmptyValue(audioRef.value?.currentTime, 0);
};

const onDurationchange = (ev: Event) => {
  appStore.songDuration = withEmptyValue(audioRef.value?.duration, 0);
};

const onEnded = () => {
  appStore.isPlaying = false;
  appStore.playNextSong();
};

const aiSearchResult = ref<AISearchRes>();
const handleAISearch = async (pageNo = 1) => {
  const { data } = await getAISearchApi(appStore.keywords, pageNo);
  aiSearchResult.value = data;
};

const handleAiSearchEnd = () => {
  commonHeaderRef.value?.searchSong();
};

const handlePageChange = (pageNo: number) => {
  commonHeaderRef.value?.searchSong(pageNo);
};

const router = useRouter();
const route = useRoute();

const redirectRouter = () => {
  if (!appStore.songDetail && route.path !== "/songlist") {
    router.push("/songlist");
  }
};

redirectRouter();

router.beforeEach((to, from) => {
  if (to.path !== "/songlist") {
    redirectRouter();
  }
});
</script>
