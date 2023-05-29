<template>
  <div class="vy-music relative h-full">
    <!-- :style="{ backgroundImage: `url(${albumDetail?.picUrl})` }" -->
    <div class="bg-mask absolute -z-10 h-full w-full"></div>
    <div class="content h-full">
      <PlayerArea />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerArea from "@/components/PlayerArea/PlayerArea.vue";
import { useAppStore } from "@/stores";
import { computed } from "vue";

const appStore = useAppStore();
const albumDetail = computed(() => appStore.albumDetail);
</script>
