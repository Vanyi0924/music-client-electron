<template>
  <div class="logos">
    <img width="100" :src="VueLogo" alt="">
    <img width="100" :src="ElectronLogo" alt="">
    <img width="85" :src="PiniaLogo" alt="">
    <img width="120" :src="ViteLogo" alt="">
  </div>
  <h1>
    electron + vue3
  </h1>
  <h3>{{ appStore.fooGet }}</h3>
  <div>
    <router-link to="/">home</router-link>
    |
    <router-link to="/page-two">page-two</router-link>
  </div>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useAppStore } from "./stores"
import { FOO } from "../constants"
import VueLogo from "./assets/imgs/vue.svg";
import ElectronLogo from "./assets/imgs/electron.svg";
import PiniaLogo from "./assets/imgs/pinia.svg";
import ViteLogo from "./assets/imgs/logo-with-shadow.png";

const appStore = useAppStore()
console.log("FOO", FOO);
</script>

<style lang="less">
body{
  text-align: center;
  -webkit-app-region: drag;
}
.logos{
  margin-top: 120px;
  > img{
    margin: 0 5px;
  }
}

</style>
