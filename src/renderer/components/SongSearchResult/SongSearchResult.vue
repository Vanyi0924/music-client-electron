<template>
  <section
    v-show="modelValue"
    class="fixed right-[theme(frameSize)] top-[theme(height.common)] z-50 w-[420px] select-none overflow-auto bg-app-dark-color-300/75 pt-4 text-white/75 shadow-md backdrop-blur-md"
    ref="songSearchResultRef"
  >
    <a-spin :spinning="spinning" :delay="200">
      <div class="h-[theme(noHeaderHeight)]">
        <p class="mb-1 pr-6 text-right text-xs" v-if="searchSongRes">
          共
          <strong class="text-app-sub-color">{{ searchSongRes?.total }}</strong>
          个结果
        </p>
        <!-- 已拥有列表 -->
        <CommonSongList v-if="searchSongRes" :list="searchSongRes?.records" />

        <div
          v-if="searchSongRes"
          class="absolute bottom-4 right-0 my-4 flex justify-end pr-4"
        >
          <a-pagination
            v-model:current="appStore.currentPage"
            size="small"
            :showSizeChanger="false"
            :total="searchSongRes?.total"
            @change="onHadSongsPageChange"
          />
        </div>

        <p v-if="!searchSongRes" class="text-center">暂无数据...</p>
      </div>
    </a-spin>
  </section>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { onMounted, onUnmounted, ref } from "vue";
import CommonSongList from "../biz/CommonSongList.vue";

interface Props {
  modelValue: boolean;
  searchSongRes?: SonglistRes;
  spinning: boolean;
}

defineProps<Props>();

const appStore = useAppStore();
const emit = defineEmits([
  "update:modelValue",
  "pageChange",
  "aiSearch",
  "aiSearchEnd",
]);

const songSearchResultRef = ref<HTMLElement>();

const isOutside = ref(true);

const listener = (evt: MouseEvent) => {
  if (songSearchResultRef.value) {
    isOutside.value = !evt.composedPath().includes(songSearchResultRef.value);
  } else {
    isOutside.value = true;
  }
  !appStore.searchIsFocus &&
    isOutside.value &&
    emit("update:modelValue", false);
};
onMounted(() => {
  window.addEventListener("click", listener);
});

onUnmounted(() => {
  window.removeEventListener("click", listener);
});

const onHadSongsPageChange = (page: number, pageSize: number) => {
  emit("pageChange", page);
};
</script>
