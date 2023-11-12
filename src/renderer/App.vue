<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#32ccbc',
        colorLink: '#32ccbc',
        colorLinkActive: '#249388',
        colorLinkHover: '#33cbbc',
      },
      algorithm: theme.darkAlgorithm,
    }"
  >
    <router-view></router-view>
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from "ant-design-vue";
import { onBeforeMount } from "vue";

onBeforeMount(() => {});
</script>

<style lang="less">
a {
  text-decoration: none;
  &:visited {
    color: unset;
  }
}
</style>
