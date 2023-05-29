<template>
  <header
    data-tauri-drag-region
    class="app-drag sticky left-0 top-0 z-50 flex h-16 w-full flex-shrink-0 items-center justify-end bg-app-dark-color-200 text-sm"
  >
    <div
      v-if="$route.path === `/playDetail`"
      class="absolute left-20 text-white"
    >
      <m-icon
        :width="24"
        class="cursor-pointer opacity-75"
        @click="$router.push(`/songlist`)"
      >
        <ArrowDropDownRoundIcon />
      </m-icon>
    </div>

    <div
      class="search-wrapper mr-6 flex h-7 items-center rounded-2xl bg-app-dark-color-500 text-white/60 transition"
    >
      <m-icon class="mx-2 flex-shrink-0" :width="16">
        <SearchIcon />
      </m-icon>

      <input
        v-model="appStore.keywords"
        class="w-[110px] flex-auto bg-transparent text-xs outline-none duration-300 focus:w-[130px]"
        type="搜索"
        placeholder="搜索"
        @keyup.enter="() => searchSong()"
        @focus="
          (appStore.searchIsFocus = true),
            (appStore.songSearchResultVisible = true)
        "
        @blur="appStore.searchIsFocus = false"
      />

      <m-icon
        v-show="appStore.keywords"
        class="mx-2 flex-shrink-0 cursor-pointer"
        :width="16"
        @click.stop="appStore.keywords = ``"
      >
        <CloseIcon />
      </m-icon>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { ref } from "vue";
import { apiSongSearch, getSonglistApi } from "../../api/http";
import ArrowDropDownRoundIcon from "@/assets/icons/vue/ArrowDropDownRound.vue";
import SearchIcon from "@/assets/icons/vue/Search.vue";
import CloseIcon from "@/assets/icons/vue/Close.vue";

const emit = defineEmits(["searchSongStart", "searchSong"]);

const searchSong = async (pageNo = 1) => {
  if (!appStore.keywords.trim().length) {
    return;
  }
  emit("searchSongStart");
  const { data } = await getSonglistApi({
    keywords: appStore.keywords.trim(),
    pageNo,
  });
  emit("searchSong", data);
};

const appStore = useAppStore();

defineExpose({
  searchSong,
});
</script>
