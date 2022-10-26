<template>
  <h1>page-one</h1>
  <button @click="sendMsg">send to main</button>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";

async function sendMsg() {
  const data = await window.electronAPI.ipcRenderer.invoke(
    "from-renderer",
    "[vue3] hi electron"
  );
  console.log(data);
}

const listenMain = (evt: any, data: any) => {
  console.log(data);
};

onMounted(() => {
  console.log("onMounted");
  window.electronAPI.onFromMain("on", listenMain);
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  window.electronAPI.onFromMain("off", listenMain);
})
</script>
