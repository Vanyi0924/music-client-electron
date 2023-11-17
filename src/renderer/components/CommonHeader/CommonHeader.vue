<template>
  <header
    class="app-drag sticky left-0 top-0 z-50 flex w-full flex-shrink-0 px-4 text-sm"
  >
    <!-- backgroud -->
    <div
      class="absolute left-0 top-0 h-full w-full bg-app-dark-color-200/90 backdrop-blur-sm"
    ></div>
    <!-- 内容区域 -->
    <div
      class="relative mx-auto flex h-common w-full items-center justify-between"
    >
      <div class="flex items-center">
        <MusicLogo />
        <!-- 前进|返回 操作按钮 -->
        <div class="opt-btn-wrapper hidden sm:flex">
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
        <div class="router-wrapper ml-8 hidden text-white/75 sm:block">
          <router-link to="/songlist">热门歌单</router-link>
          <!-- <router-link to="/songlist1">排行榜</router-link> -->
        </div>
      </div>

      <div class="right-wrapper flex">
        <!-- 未登录  -->
        <div
          v-if="!accountStore.isLogin"
          class="mr-4 flex items-center opacity-80"
        >
          <a-tooltip placement="top">
            <template #title>
              <span>登录后可下载、收藏海量歌曲</span>
            </template>
            <a-button
              class="account-btn login-btn"
              type="link"
              @click="showModal(true)"
              >登录</a-button
            >
          </a-tooltip>

          <a-divider type="vertical" class="m-0" />
          <a-button
            class="account-btn regist-btn"
            type="link"
            @click="showModal(false)"
            >注册</a-button
          >
        </div>
        <!-- 已登录 -->
        <div v-else class="mr-4 flex cursor-pointer items-center">
          <a-dropdown placement="bottom">
            <UserOutlined style="font-size: 20px" class="text-white" />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">{{ accountStore.user?.email }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="handleLogout">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <m-icon
          class="mx-2 flex-shrink-0 cursor-pointer text-white sm:hidden"
          :width="20"
          @click="mobileSearchMenuVisible = true"
        >
          <SearchIcon />
        </m-icon>

        <m-icon
          class="mx-2 flex-shrink-0 cursor-pointer text-white sm:hidden"
          :width="20"
          @click="mobileMenuVisible = true"
        >
          <MoreIcon />
        </m-icon>

        <a-input
          class="hidden sm:block"
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
          @change="searchChange"
        >
          <template #prefix>
            <m-icon class="mx-2 flex-shrink-0" :width="16">
              <SearchIcon />
            </m-icon>
          </template>
        </a-input>
      </div>
    </div>
    <!-- 搜索结果 -->
    <SongSearchResult
      v-model="appStore.songSearchResultVisible"
      :search-song-res="searchSongRes"
      :spinning="spinning"
      @page-change="handlePageChange"
    />

    <!-- mobile 菜单 -->
    <a-modal v-model:open="mobileMenuVisible" :footer="null">
      <router-link to="/songlist">热门歌单</router-link>
    </a-modal>

    <!-- mobile 菜单 -->
    <a-modal v-model:open="mobileSearchMenuVisible" :footer="null">
      <div class="flex h-[60vh] flex-col">
        <a-input-search
          v-model:value="appStore.keywords"
          placeholder="搜索"
          enter-button
          allowClear
          style="margin-top: 24px"
          @search="() => searchSong()"
        />
        <p v-if="searchSongRes" class="my-2 text-right text-xs">
          共
          <strong class="text-app-base-color">{{ searchSongRes.total }}</strong>
          个结果
        </p>
        <ul class="h-0 flex-auto overflow-auto scroll-auto" ref="scrollEl">
          <li
            v-for="(record, index) in searchSongRes?.records"
            class="flex py-2"
          >
            <i class="w-8">{{ paddingStrStart(index + 1) }}</i>
            <span class="flex-auto">{{ record.name }}</span>
            <span class="w-16 flex-shrink-0 truncate text-right">{{
              record.singerName
            }}</span>
          </li>
        </ul>
      </div>
    </a-modal>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { ref, watch } from "vue";
import ArrowDropDownRoundIcon from "@/assets/icons/vue/ArrowDropDownRound.vue";
import SearchIcon from "@/assets/icons/vue/Search.vue";
import MoreIcon from "@/assets/icons/vue/More.vue";
import { Api } from "@/http";
import MusicLogo from "@/components/MusicLogo/MusicLogo.vue";
import SongSearchResult from "@/components/SongSearchResult/SongSearchResult.vue";
import { useAccountStore } from "@/stores/account";
import { UserOutlined, MoreOutlined } from "@ant-design/icons-vue";
import { logout } from "@/http/api";
import { paddingStrStart } from "@/utils";
import { useScroll } from "@vueuse/core";

const emit = defineEmits([]);

const spinning = ref(false);

const searchSong = async (pageNo = 1) => {
  if (!appStore.keywords.trim().length) {
    return;
  }

  if (spinning.value) {
    return;
  }

  appStore.currentPage = pageNo;
  spinning.value = true;
  const { data } = await Api.searchSongs(appStore.keywords.trim(), pageNo, 15);
  spinning.value = false;
  if (pageNo === 1) {
    scrollEl.value?.scrollTo(0, 0);
    searchSongRes.value = data;
  } else {
    searchSongRes.value!.total = data.total;
    searchSongRes.value!.records = [
      ...searchSongRes.value!.records,
      ...data.records,
    ];
  }
};

const appStore = useAppStore();
const searchSongRes = ref<SonglistRes>();
const resetSearchSongRes = () => {
  searchSongRes.value = undefined;
};

const handlePageChange = (pageNo: number) => {
  searchSong(pageNo);
};

const accountStore = useAccountStore();

const showModal = (isLogin: boolean) => {
  accountStore.loginRegisterModal.visible = true;
  accountStore.loginRegisterModal.isLogin = isLogin;
};

const handleLogout = async () => {
  await logout();
  appStore.removePlaylist();
  accountStore.removeUser();
};

const searchChange = () => {
  resetSearchSongRes();
  appStore.currentPage = 1;
  appStore.songSearchResultVisible = false;
};

const mobileMenuVisible = ref(false);
const mobileSearchMenuVisible = ref(false);

const scrollEl = ref<HTMLElement | null>(null);
const { x, y, isScrolling, arrivedState, directions } = useScroll(scrollEl, {
  offset: {
    bottom: 60,
  },
});

watch(y, () => {
  if (arrivedState.bottom && !spinning.value) {
    if (searchSongRes.value) {
      if (searchSongRes.value.records.length < searchSongRes.value.total) {
        searchSong(++appStore.currentPage);
      } else {
        // ...
      }
    } else {
      searchSong(++appStore.currentPage);
    }
  }
});
</script>

<style lang="less" scoped>
.opt-btn {
  @apply flex items-center justify-center text-app-white-color-100;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    @apply bg-app-white-color-100/20;
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

.router-wrapper {
  & > a {
    @apply mr-4;
    &.router-link-exact-active {
      @apply text-lg text-white;
    }
  }
}

.account-btn {
  @apply text-white/75 transition-all hover:text-white;
  &.regist-btn {
    @apply text-app-base-color/90 hover:text-app-base-color;
  }
}
</style>
