<template>
  <ul class="section-item select-none">
    <li
      class="section-item-list relative flex cursor-pointer py-2 pl-7 text-xs even:bg-app-dark-color-400/50 hover:text-white"
      v-for="(l, index) in list"
      @dblclick="$emit(`dblclick`, l)"
    >
      <slot :data="l" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  list?: any[];
}

defineProps<Props>();
defineEmits(["dblclick"]);
</script>

<style lang="less" scoped></style>
