<template>
  <header
    class="app-drag sticky left-0 top-0 z-50 flex w-full flex-shrink-0 text-sm backdrop-blur-sm"
  >
    <!-- 内容区域 -->
    <div
      class="app-header-height limit-width relative mx-auto flex items-center justify-between"
    >
      <!-- <button
        v-if="$route.path !== `/songlist`"
        class="mr-4 text-white"
        @click="$router.back()"
      >
        返回
      </button>
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
      </div> -->
      <div class="flex items-center">
        <MusicLogo />
        <div
          class="opt-btn prev"
          :class="[!appStore.routerCanBack && `disabled`]"
          @click="appStore.routerCanBack && $router.back()"
        >
          <m-icon :width="18">
            <ArrowDropDownRoundIcon />
          </m-icon>
        </div>
        <div
          class="opt-btn next"
          :class="[!appStore.routerCanForward && `disabled`]"
          @click="appStore.routerCanForward && $router.forward()"
        >
          <m-icon :width="18">
            <ArrowDropDownRoundIcon />
          </m-icon>
        </div>
      </div>

      <div class="search-wrapper">
        <a-input
          v-model:value="appStore.keywords"
          placeholder="搜索"
          allow-clear
          style="border-radius: 1rem"
          @keyup.enter="() => searchSong()"
          @focus="
            (appStore.searchIsFocus = true),
              (appStore.songSearchResultVisible = true)
          "
          @blur="appStore.searchIsFocus = false"
        >
          <template #prefix>
            <m-icon class="mx-2 flex-shrink-0" :width="16">
              <SearchIcon />
            </m-icon>
          </template>
        </a-input>
      </div>
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { ref } from "vue";
import ArrowDropDownRoundIcon from "@/assets/icons/vue/ArrowDropDownRound.vue";
import SearchIcon from "@/assets/icons/vue/Search.vue";
import CloseIcon from "@/assets/icons/vue/Close.vue";
import { Api } from "@music/common";
import MusicLogo from "@/components/MusicLogo/MusicLogo.vue";

const emit = defineEmits(["searchSongStart", "searchSong"]);

const searchSong = async (pageNo = 1) => {
  if (!appStore.keywords.trim().length) {
    return;
  }
  emit("searchSongStart");
  appStore.currentPage = pageNo;
  const { data } = await Api.searchSongs(appStore.keywords.trim(), pageNo);
  emit("searchSong", data);
};

const appStore = useAppStore();

defineExpose({
  searchSong,
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

header {
  background-color: rgba(@app-dark-color-200, 0.9);
}

.opt-btn {
  @apply flex items-center justify-center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: @app-white-color-100;
  // background-color: rgba(@app-white-color-100, 5);
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    background-color: rgba(@app-white-color-100, 0.2);
  }
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background-color: unset;
    }
  }
  &.prev {
    margin-left: 16px;
    transform: rotate(90deg);
  }
  &.next {
    margin-left: 4px;
    transform: rotate(-90deg);
  }
}
</style>
