<template>
  <ul class="section-item select-none">
    <li
      class="section-item-list relative flex cursor-pointer py-2 pl-4 text-xs even:bg-app-dark-color-400/50 hover:text-white sm:pl-7"
      v-for="(l, index) in list"
      @[triggerEvt]="handlePlay(l)"
    >
      <slot :data="l" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { isMobile } from "@/utils";
import { onMounted, ref } from "vue";

interface Props {
  list?: any[];
}

defineProps<Props>();
const emit = defineEmits(["play"]);

const triggerEvt = ref("click");

onMounted(() => {
  triggerEvt.value = isMobile() ? "click" : "dblclick";
});

const handlePlay = (l: any) => {
  emit(`play`, l);
};
</script>

<style lang="less" scoped></style>
