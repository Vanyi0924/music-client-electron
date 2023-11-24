<template>
  <div
    class="player-bar fixed bottom-0 left-0 flex h-common w-full justify-center bg-app-dark-color-300 px-4 text-white"
  >
    <!-- 进度条 -->
    <!--  <ProgressBar
      v-model:process="process"
    /> -->

    <a-slider
      class="song-progress-bar absolute top-[-16px] z-50 w-full"
      v-model:value="process"
      :tooltipOpen="false"
    />

    <div
      class="relative flex w-full max-w-[theme(width.limit)] items-center justify-center lg:mx-auto"
    >
      <!-- 歌曲信息 -->
      <div class="song-detail absolute left-0">
        <div class="thumbnail group flex items-center justify-center">
          <div v-if="appStore?.albumDetail" class="relative">
            <a-image
              :preview="false"
              :src="appStore?.albumDetail.picUrl"
              :placeholder="true"
              width="52px"
              fallback="data:image/png;base64,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"
            />

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
      <div class="controls z-10 flex items-center fill-app-base-color">
        <!-- 上一曲 -->
        <m-icon @click="switchSong(SwitchSongDirection.prev)">
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
        <m-icon @click="switchSong(SwitchSongDirection.next)">
          <ForwardStepIcon />
        </m-icon>
      </div>

      <!-- 操作区域 播放列表 | 循环策略等 -->
      <div
        class="opt-area absolute right-0 flex items-center text-app-base-color"
      >
        <a-tooltip placement="top">
          <template #title>
            <span>{{ curPlayModel?.label }}</span>
          </template>
          <m-icon
            class="mr-4"
            :width="20"
            @click="() => appStore.setPlayModel()"
          >
            <component :is="curPlayModel?.icon" />
          </m-icon>
        </a-tooltip>

        <m-icon :width="24" @click.stop="appStore.showPlaylist = true">
          <MenuIcon />
        </m-icon>
      </div>
    </div>

    <!-- 播放列表 -->
    <div
      v-show="appStore.showPlaylist"
      ref="playlistEl"
      class="fixed bottom-0 left-0 z-10 h-[100vh] w-full"
      @click.self.stop="appStore.showPlaylist = false"
    >
      <div
        class="absolute bottom-20 ml-[2.5%] h-[60%] w-[95%] overflow-auto rounded-t-xl bg-app-dark-color-300/75 py-4 backdrop-blur-md md:right-[theme(frameSize)] md:h-[420px] md:w-[420px]"
      >
        <p class="my-4 ml-4 flex justify-between opacity-75 sm:ml-7">
          播放列表
        </p>

        <m-icon
          class="absolute right-3 top-3"
          :width="24"
          :opacity="0.75"
          @click="appStore.showPlaylist = false"
        >
          <CloseIcon />
        </m-icon>
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
import { SongDetail } from "@/typing";

interface Props {
  songDetail?: SongDetail;
}

const props = defineProps<Props>();

defineEmits(["actionPlay"]);

const appStore = useAppStore();

const process = computed({
  get: () => (appStore.playingTimestamp / appStore.songDuration) * 100,
  set: (newVal) => {
    if (appStore.audioEl) {
      appStore.audioEl.currentTime = (appStore.songDuration * newVal) / 100;
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
