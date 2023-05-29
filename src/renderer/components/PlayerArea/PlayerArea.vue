<template>
  <div
    class="player-area mx-auto flex h-full max-w-[920px] justify-between px-20 pt-6"
  >
    <div class="mr-8 flex-shrink-0">
      <!-- :style="{ animationPlayState: appState.isPlaying ? `running` : `paused` }" -->
      <img :src="albumDetail?.picUrl" width="340" class="smooth-corner" />
    </div>

    <div class="song-info min-w-[340px] text-white">
      <h3 class="text-3xl">{{ songDetail?.name }}</h3>
      <div class="info my-4 flex text-13 opacity-60">
        <div class="info-item flex">
          <label>专辑：</label>
          <p
            class="text max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
            :title="songDetail?.albumName"
          >
            {{ songDetail?.albumName }}
          </p>
        </div>
        <div class="info-item ml-6 flex">
          <label>歌手：</label>
          <p
            class="text max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
            :title="songDetail?.albumName"
          >
            {{ songDetail?.singerName }}
          </p>
        </div>
      </div>
      <div v-if="lyricArr.length" class="lyric-wrapper">
        <div
          class="scroll-content overflow-hidden"
          :style="{ height: `${scrollYCenterPos}px` }"
          @scroll="onScroll"
        >
          <div
            ref="scrollContentRef"
            class="line-lyric-wrapper text-white/90 transition-transform duration-200 ease-linear"
          >
            <div
              class="line-lyric mb-3 h-6 w-fit max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap break-keep"
              v-for="l in lyricArr"
              :key="l.time"
              :class="[l.active && `active`]"
            >
              {{ l.lineLyric }}
            </div>
          </div>
        </div>
      </div>

      <p v-else class="mt-24 text-center opacity-75">纯音乐，请欣赏</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { lyricStr2PerLyric, lyricStr2PerLyricV2 } from "@/utils";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import MusicIcon from "@/assets/icons/vue/Music.vue";

interface Props {}

const appStore = useAppStore();
const albumDetail = computed(() => appStore.albumDetail);
const songDetail = computed(() => appStore.songDetail);

const scrollContentRef = ref<HTMLDivElement>();

// const props = defineProps<Props>();

const lyricArr = ref<PerLyric[]>([]);

const perLineHeight = 36;

watch(
  () => songDetail.value?.lyric,
  (newVal) => {
    if (newVal) {
      lyricArr.value = lyricStr2PerLyricV2(newVal);
    }
  },
  {
    immediate: true,
  }
);

const appState = useAppStore();

watch(
  () => appState.playingTimestamp,
  (newVal) => {
    if (lyricArr.value && lyricArr.value.length) {
      activeLine(newVal);
    }
  }
);

const activeLineIndex = ref(0);

// background-image: linear-gradient( 135deg, #81FFEF 10%, #F067B4 100%);

const activeLine = (ts: number) => {
  let breakIndex = 0;
  for (const k in lyricArr.value) {
    const _k = Number(k);
    if (!_k) {
      continue;
    } else {
      lyricArr.value[_k - 1].active = lyricArr.value[_k].time >= ts;
      activeLineIndex.value = _k - 1;
      if (lyricArr.value[_k - 1].active) {
        breakIndex = _k;
        break;
      }
    }
  }

  // 处理 向前拖拽 后面歌词仍高亮
  for (let i = breakIndex; i < lyricArr.value.length; i++) {
    lyricArr.value[i].active = false;
  }
  // 最后一行
  if (breakIndex === 0) {
    lyricArr.value[lyricArr.value.length - 1].active = true;
  }
};

const scrollYCenterPos = ref(360);

const isManualScrolling = ref(false);
const timer = ref(0);

const onScroll = () => {
  // 未做限流触发频率高
  // if (isManualScrolling.value) {
  //   window.clearTimeout(timer.value);
  //   timer.value = window.setTimeout(() => {
  //     isManualScrolling.value = false;
  //   }, 3000);
  // } else {
  //   isManualScrolling.value = true;
  // }
};

watch(activeLineIndex, (newVal) => {
  if (isManualScrolling.value) return;
  const gap = (newVal + 2) * perLineHeight - scrollYCenterPos.value / 2;
  if (gap > 0) {
    scrollContentRef.value!.style.transform = `translateY(-${gap}px)`;
    // scrollContentRef.value?.scroll({ left: 0, top: gap });
    // scrollContentRef.value?.scroll({ left: 0, top: gap, behavior: "smooth" });
  } else {
    scrollContentRef.value!.style.transform = `translateY(${0}px)`;
    // scrollContentRef.value?.scroll({ left: 0, top: 0 });
  }
});
</script>

<style lang="css" scoped>
.line-lyric.active {
  color: transparent;
  /* mask-image: -webkit-gradient(135deg, #81ffef 10%, #f067b4 100%); */
  background-image: linear-gradient(135deg, #81ffef 10%, #f067b4 100%);
  background-clip: text;
  font-weight: 600;
}
</style>
