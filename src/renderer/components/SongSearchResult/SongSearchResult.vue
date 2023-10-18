<template>
  <section
    v-show="modelValue"
    class="bg-app-dark-color-300/75 search-result-height top-common-height absolute right-0 z-50 w-[420px] select-none overflow-auto py-4 text-white/75 shadow-md backdrop-blur-md"
    ref="songSearchResultRef"
  >
    <div v-if="searchSongRes?.total">
      <p class="mb-1 pr-6 text-right text-xs">
        共
        <strong class="text-app-sub-color">{{ searchSongRes.total }}</strong>
        个结果
      </p>
      <!-- 已拥有列表 -->
      <CommonSongList :list="searchSongRes?.records" />

      <div class="my-4 flex justify-end pr-4">
        <a-pagination
          v-model:current="appStore.currentPage"
          size="small"
          :showSizeChanger="false"
          :total="searchSongRes?.total"
          @change="onHadSongsPageChange"
        />
      </div>
    </div>
    <!-- <p
      v-show="searchSongRes"
      class="my-4 text-center text-xs"
      @click="$emit(`aiSearch`)"
    >
      没有想要的结果？试试AI
      <span
        class="cursor-pointer text-app-sub-color/75 hover:text-app-sub-color"
      >
        搜索
      </span>
    </p> -->
    <div v-if="aiSearchSongRes?.total">
      <div class="flex items-center justify-between pl-6">
        <div v-if="isSearching" class="flex items-center text-xs opacity-50">
          <m-icon class="animate-bounce">
            <CloudDownloadOutlinedIcon />
          </m-icon>
          <span class="ml-2">资源下载中</span>
        </div>
        <div v-else></div>
        <p class="pr-6 text-right text-xs">
          共
          <strong class="text-app-sub-color">{{
            aiSearchSongRes?.total
          }}</strong>
          个结果
        </p>
      </div>
      <!-- ai搜索列表 -->
      <ul class="section-item">
        <li
          class="section-item-list even:bg-app-dark-color-400/50 relative flex cursor-pointer py-2 pl-7 text-xs hover:text-white"
          v-for="song in aiSearchSongRes?.records"
          @dblclick="handleAISearch(song)"
        >
          <m-icon
            v-if="song.is_in_database"
            class="absolute left-1 top-1 text-app-sub-color"
          >
            <DownloadDoneRoundIcon />
          </m-icon>
          <p
            class="w-0 flex-auto overflow-hidden text-ellipsis whitespace-nowrap pr-6"
            :title="song.name"
          >
            {{ song.name }}
          </p>
          <span
            class="w-20 overflow-hidden text-ellipsis whitespace-nowrap pr-1 opacity-80"
            :title="song.album_name"
            >{{ song.album_name }}</span
          >
          <span
            class="w-20 overflow-hidden text-ellipsis whitespace-nowrap pr-2 opacity-60"
            :title="song.singer_name"
            >{{ song.singer_name }}</span
          >
        </li>
      </ul>

      <div class="my-4 flex justify-end pr-4">
        <a-pagination
          size="small"
          :showSizeChanger="false"
          :total="aiSearchSongRes?.total"
          @change="(pageNo: number) => $emit(`aiSearch`, pageNo)"
        />
      </div>
    </div>
    <p
      v-if="!searchSongRes?.records.length && !aiSearchSongRes?.total"
      class="mt-4 text-center text-xs opacity-75"
    >
      输入关键字，Enter 键进行搜索...
    </p>
  </section>
</template>

<script setup lang="ts">
import DownloadDoneRoundIcon from "@/assets/icons/vue/DownloadDoneRound.vue";
import CloudDownloadOutlinedIcon from "@/assets/icons/vue/CloudDownloadOutlined.vue";
import { useAppStore } from "@/stores";
import { onMounted, onUnmounted, ref } from "vue";
import { message } from "ant-design-vue";
import CommonSongList from "../biz/CommonSongList.vue";

interface Props {
  modelValue: boolean;
  searchSongRes?: SonglistRes;
  aiSearchSongRes?: {
    records: AISongDetail[];
    total: number;
  };
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
const isSearching = ref(false);
const handleAISearch = async (song: AISongDetail) => {
  /*   if (song.is_in_database) {
    const { data } = await getSongDetailByNameApi({
      artistName: song.singer_name,
      albumName: song.album_name,
      songName: song.name,
    });

    appStore.handlePlay(data);

    return;
  }
  if (isSearching.value) {
    message.warning("请等待当前资源加载完成");
    return;
  }
  isSearching.value = true;
  await getAISongDetailApi(song.id);
  isSearching.value = false;
  song.is_in_database = true;
  emit("aiSearchEnd"); */
};

const onHadSongsPageChange = (page: number, pageSize: number) => {
  emit("pageChange", page);
};
</script>
