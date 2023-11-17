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
import { onBeforeMount, onMounted, ref } from "vue";
import { getStream } from "./http/api";

onBeforeMount(() => {});

onMounted(() => {});

const myUrl = ref("");

const test = async () => {
  const { data } = await getStream();
  console.log(data);
  let url = window.URL.createObjectURL(data);
  console.log(url);
  myUrl.value = url;
};
</script>

<style lang="less">
a {
  text-decoration: none;
  &:visited {
    color: unset;
  }
}
</style>
