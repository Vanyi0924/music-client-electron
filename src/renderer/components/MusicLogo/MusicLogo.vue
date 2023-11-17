<template>
  <div
    class="music-logo flex cursor-pointer items-center"
    @click="$router.push(`/songlist`)"
  >
    <div
      class="flex aspect-[1] w-9 flex-shrink-0 items-center justify-center rounded-[50%] bg-white sm:w-12"
    >
      <img :src="Logo" alt="律动音乐" class="w-5 sm:w-8" />
    </div>
    <span class="ml-2 text-base text-white sm:text-lg">律动音乐</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/assets/imgs/logo.svg";
</script>

<style lang="less" scoped></style>
