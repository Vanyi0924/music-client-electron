<template>
  <div
    class="player-bar fixed bottom-0 left-0 flex h-common w-full justify-center bg-app-dark-color-300 px-4 text-white"
  >
    <!-- 进度条 -->
    <ProgressBar
      v-model:process="process"
      class="song-progress-bar absolute top-0"
    />

    <div class="relative flex w-full items-center justify-center">
      <!-- 歌曲信息 -->
      <div class="song-detail absolute left-0">
        <div class="thumbnail group flex items-center justify-center">
          <div v-if="appStore?.albumDetail" class="relative">
            <img :src="appStore?.albumDetail.picUrl" width="52" height="52" />

            <div
              v-if="$route.path !== `/playDetail`"
              class="mask absolute left-0 top-0 hidden h-full w-full cursor-pointer items-center justify-center bg-black/60 backdrop-blur-sm group-hover:flex"
              @click="showPlayerDetail"
            >
              <m-icon :width="24" class="-rotate-45 opacity-60">
                <ArrowIcon />
              </m-icon>
            </div>
          </div>

          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-app-base-color text-white"
          >
            <MIcon>
              <MusicIcon />
            </MIcon>
          </div>
        </div>
        <div class="song-name hidden sm:block">
          <div v-if="songDetail">
            <span>{{ songDetail?.name }}</span>
            <span class="singer text-xs opacity-50">
              -
              <em>{{ songDetail?.singerName }}</em>
            </span>
          </div>
          <div v-else>请选择歌曲</div>
        </div>
        <div class="song-time hidden text-xs opacity-50 sm:block">
          {{ number2Time(appStore.playingTimestamp) }} /
          {{ number2Time(appStore.songDuration) }}
        </div>
      </div>

      <!-- 控制 -->
      <div class="controls flex items-center fill-app-base-color">
        <!-- 上一曲 -->
        <m-icon @click.stop="switchSong(SwitchSongDirection.prev)">
          <BackwardStepIcon />
        </m-icon>
        <div class="play-pause relative mx-4 flex items-center justify-center">
          <m-icon
            v-show="!appStore.isPlaying"
            :width="40"
            @click="$emit(`actionPlay`)"
          >
            <CirclePlayIcon />
          </m-icon>
          <m-icon
            v-show="appStore.isPlaying"
            :width="40"
            @click="$emit(`actionPlay`)"
          >
            <CirclePauseIcon />
          </m-icon>
        </div>
        <!-- 下一曲 -->
        <m-icon @click.stop="switchSong(SwitchSongDirection.next)">
          <ForwardStepIcon />
        </m-icon>
      </div>

      <!-- 操作区域 播放列表 | 循环策略等 -->
      <div
        class="opt-area absolute right-0 flex items-center text-app-base-color"
      >
        <m-icon
          class="mr-4"
          :width="24"
          @click.stop="appStore.showPlaylist = true"
        >
          <MenuIcon />
        </m-icon>

        <a-tooltip placement="top">
          <template #title>
            <span>{{ curPlayModel?.label }}</span>
          </template>
          <m-icon :width="20" @click="() => appStore.setPlayModel()">
            <component :is="curPlayModel?.icon" />
          </m-icon>
        </a-tooltip>
      </div>
    </div>

    <!-- 播放列表 -->
    <div
      v-show="appStore.showPlaylist"
      ref="playlistEl"
      class="fixed bottom-20 right-[theme(frameSize)] h-[420px] w-[420px] overflow-auto bg-app-dark-color-300/75 py-4 backdrop-blur-md"
    >
      <p class="mb-1 ml-7 opacity-75">播放列表</p>
      <CommonSongList :list="appStore.playlist">
        <template #suffix="{ song }">
          <div class="pr-4">
            <m-icon
              :width="16"
              :opacity="0.75"
              @click="removePlaylistItem(song)"
            >
              <CloseIcon />
            </m-icon>
          </div>
        </template>
      </CommonSongList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import {
  PlayModel,
  SwitchSongDirection,
  getPlayModel,
  nextSongIndex,
  number2Time,
} from "@/utils";
import { computed, ref, onMounted, watch } from "vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import VolumeLowIcon from "@/assets/icons/vue/VolumeLow.vue";
import ForwardStepIcon from "@/assets/icons/vue/ForwardStep.vue";
import CirclePlayIcon from "@/assets/icons/vue/CirclePlay.vue";
import CirclePauseIcon from "@/assets/icons/vue/CirclePause.vue";
import BackwardStepIcon from "@/assets/icons/vue/BackwardStep.vue";
import MusicIcon from "@/assets/icons/vue/Music.vue";
import ArrowIcon from "@/assets/icons/vue/ArrowBidirectionalUpDown20Filled.vue";
import MenuIcon from "@/assets/icons/vue/MenuOpenRound.vue";
import CloseIcon from "@/assets/icons/vue/Close.vue";
import LoopListIcon from "@/assets/icons/vue/LoopList.vue";
import LoopRandomIcon from "@/assets/icons/vue/LoopRandom.vue";
import LoopSingleIcon from "@/assets/icons/vue/LoopSingle.vue";
import router from "@/router";
import CommonSongList from "../biz/CommonSongList.vue";
import { useClickIsOutside } from "@/hooks";

interface Props {
  songDetail?: SongDetail;
}

const props = defineProps<Props>();

defineEmits(["actionPlay"]);

const appStore = useAppStore();

const process = computed({
  get: () => appStore.playingTimestamp / appStore.songDuration,
  set: (newVal) => {
    if (appStore.audioEl) {
      appStore.audioEl.currentTime = appStore.songDuration * newVal;
    }
  },
});

const showPlayerDetail = () => {
  router.push("/playDetail");
};

const playlistEl = ref<HTMLDivElement>();

const setEl = useClickIsOutside((v: boolean) => {
  v && (appStore.showPlaylist = false);
});

onMounted(() => {
  setEl(playlistEl.value);
});

const removePlaylistItem = (song: SongDetail) => {
  appStore.removeExistInPlaylistItem(song);
};

const switchSong = (dir: SwitchSongDirection) => {
  appStore.playNextSong(dir);
};

const curPlayModel = computed(() => getPlayModel(appStore.playModel));
</script>

<style lang="css" scoped>
.m-icon {
  cursor: pointer;
}
.m-icon > svg {
  width: 100%;
  height: 100%;
}

.song-detail {
  display: grid;
  grid-template-columns: 52px max(240px);
  grid-template-rows: 50% 50%;
  gap: 0 10px;
  align-items: center;
}
.thumbnail {
  position: relative;
  z-index: 100;
  grid-row: 1 / 3;
  grid-column: 1 / 2;
  border-radius: 10px;
  width: 100%;
  height: 52px;
  overflow: hidden;
}

.thumbnail > img {
  width: 100%;
  height: 100%;
}
</style>
