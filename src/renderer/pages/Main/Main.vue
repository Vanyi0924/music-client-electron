<template>
  <main class="flex min-h-[100vh] flex-col bg-app-dark-color-200 text-gray-950">
    <CommonHeader ref="commonHeaderRef"> </CommonHeader>

    <!-- VIEW -->
    <div class="mx-auto mb-[theme(height.common)] mt-5 pb-5">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <PlayerBar :song-detail="songDetail" @action-play="onActionPlay" />
    <audio
      ref="audioRef"
      :src="appStore?.songDetailURL"
      @timeupdate="onTimeupdate"
      @durationchange="onDurationchange"
      @ended="onEnded"
    ></audio>

    <!-- 登录、注册 modal -->
    <LoginRegisterModal />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import PlayerBar from "@/components/PlayerBar/PlayerBar.vue";
import { useAppStore } from "@/stores";
import { withEmptyValue } from "@/utils";
import { useRoute, useRouter } from "vue-router";

const commonHeaderRef = ref<any>();

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
