<template>
  <div
    class="music-logo flex cursor-pointer items-center"
    @click="$router.push(`/songlist`)"
  >
    <div
      class="logo-wrapper flex h-12 w-12 items-center justify-center rounded-[50%] bg-white"
    >
      <img :src="Logo" alt="律动音乐" class="w-8" />
    </div>
    <span class="ml-2 text-lg text-white">律动音乐</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/assets/imgs/logo.svg";
</script>

<style lang="less" scoped>
.logo-wrapper {
}
</style>
