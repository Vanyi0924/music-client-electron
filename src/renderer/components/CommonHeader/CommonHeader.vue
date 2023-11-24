<template>
  <header
    class="app-drag sticky left-0 top-0 z-50 flex w-full flex-shrink-0 px-4 text-sm lg:px-0"
  >
    <!-- backgroud -->
    <div
      class="absolute left-0 top-0 h-full w-full bg-app-dark-color-200/90 backdrop-blur-sm"
    ></div>
    <!-- 内容区域 -->
    <div
      class="relative mx-auto flex h-common w-full max-w-[theme(width.limit)] items-center justify-between lg:mx-auto"
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
        <div class="router-wrapper ml-8 hidden text-white/75 md:block">
          <router-link to="/songlist">热门歌单</router-link>
          <!-- <router-link to="/songlist1">排行榜</router-link> -->
        </div>
      </div>

      <div class="right-wrapper flex items-center">
        <!-- 未登录  -->
        <div v-if="!accountStore.isLogin" class="flex items-center opacity-80">
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
          <a-dropdown placement="bottom" :trigger="['click', 'hover']">
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
          class="mx-2 flex-shrink-0 cursor-pointer text-white md:hidden"
          :width="20"
          @click="mobileSearchMenuVisible = true"
        >
          <SearchIcon />
        </m-icon>

        <m-icon
          class="mx-2 flex-shrink-0 cursor-pointer text-white md:hidden"
          :width="20"
          @click="mobileMenuVisible = true"
        >
          <MoreIcon />
        </m-icon>

        <a-input
          class="hidden md:flex"
          v-model:value="appStore.keywords"
          placeholder="搜索"
          allow-clear
          style="border-radius: 1rem"
          @keyup.enter="() => searchSong()"
        >
          <!-- @focus="
            (appStore.searchIsFocus = true),
              (appStore.songSearchResultVisible = true)
          "
          @blur="appStore.searchIsFocus = false"
          @change="searchChange" -->
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
      <router-link
        class="block w-full"
        to="/songlist"
        @click="mobileMenuVisible = false"
        >热门歌单</router-link
      >
    </a-modal>

    <!-- mobile 搜索 -->
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
        <div class="h-0 flex-auto overflow-auto scroll-auto" ref="scrollEl">
          <CommonSongList
            class="search-songlist"
            :list="searchSongRes?.records"
          ></CommonSongList>
        </div>
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
import { SongDetail } from "@/typing";
import { setSongFavoriteState } from "@/utils/index-biz";

const emit = defineEmits([]);

const spinning = ref(false);

const searchSong = async (pageNo = 1) => {
  if (!appStore.keywords.trim().length) {
    return;
  }

  if (spinning.value) {
    return;
  }

  mobileSearchMenuVisible.value = true;

  appStore.currentPage = pageNo;
  spinning.value = true;
  const { data } = await Api.searchSongs(appStore.keywords.trim(), pageNo, 15);
  spinning.value = false;
  if (pageNo === 1) {
    scrollEl.value?.scrollTo(0, 0);
    searchSongRes.value = {
      total: data.total,
      records: data.records.map((r) => setSongFavoriteState(r)),
    };
  } else {
    searchSongRes.value!.total = data.total;
    searchSongRes.value!.records = [
      ...searchSongRes.value!.records,
      ...data.records.map((r) => setSongFavoriteState(r)),
    ];
  }
};

const appStore = useAppStore();
const searchSongRes = ref<{
  records: SongDetail[];
  total: number;
}>();
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
  if (arrivedState.bottom && !spinning.value && appStore.keywords) {
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
      @apply text-lg;
    }
  }
}

.account-btn {
  @apply text-white/75 transition-all hover:text-white;
  &.regist-btn {
    @apply text-app-base-color/90 hover:text-app-base-color;
  }
}

.search-songlist {
  :deep(li) {
    padding-left: 0;
    .index {
      width: 28px;
    }
  }
}
</style>
