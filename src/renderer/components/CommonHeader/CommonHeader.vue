<template>
  <header
    class="app-drag sticky left-0 top-0 z-50 flex w-full flex-shrink-0 text-sm"
  >
    <!-- backgroud -->
    <div
      class="absolute left-0 top-0 h-full w-full bg-app-dark-color-200/90 backdrop-blur-sm"
    ></div>
    <!-- 内容区域 -->
    <div
      class="relative mx-auto flex h-common w-limit items-center justify-between"
    >
      <div class="flex items-center">
        <MusicLogo />
        <!-- 前进|返回 操作按钮 -->
        <div class="opt-btn-wrapper flex">
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
        <div class="router-wrapper ml-8 text-white/75">
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
          <a-tooltip placement="top">
            <template #title>
              <span>{{ accountStore.user?.email }}</span>
            </template>
            <UserOutlined style="font-size: 20px" class="text-white" />
          </a-tooltip>
        </div>
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
    </div>
    <!-- 搜索结果 -->
    <SongSearchResult
      v-model="appStore.songSearchResultVisible"
      :search-song-res="searchSongRes"
      :spinning="spinning"
      @page-change="handlePageChange"
    />
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import { ref } from "vue";
import ArrowDropDownRoundIcon from "@/assets/icons/vue/ArrowDropDownRound.vue";
import SearchIcon from "@/assets/icons/vue/Search.vue";
import { Api } from "@/http";
import MusicLogo from "@/components/MusicLogo/MusicLogo.vue";
import SongSearchResult from "@/components/SongSearchResult/SongSearchResult.vue";
import { useAccountStore } from "@/stores/account";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

const emit = defineEmits([]);

const spinning = ref(false);

const searchSong = async (pageNo = 1) => {
  if (!appStore.keywords.trim().length) {
    return;
  }
  appStore.currentPage = pageNo;
  spinning.value = true;
  const { data } = await Api.searchSongs(appStore.keywords.trim(), pageNo, 15);
  spinning.value = false;
  searchSongRes.value = data;
};

const appStore = useAppStore();
const searchSongRes = ref<SonglistRes>();

const handlePageChange = (pageNo: number) => {
  searchSong(pageNo);
};

const accountStore = useAccountStore();

const showModal = (isLogin: boolean) => {
  accountStore.loginRegisterModal.visible = true;
  accountStore.loginRegisterModal.isLogin = isLogin;
};
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
