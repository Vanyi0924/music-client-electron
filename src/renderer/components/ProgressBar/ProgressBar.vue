<template>
  <div
    class="progress-bar -translate-y-1/2"
    ref="progressBarRef"
    @click="onProgressBarClick"
  >
    <div
      class="process-content bg-app-base-color"
      :style="{ width: currentPos.x + 'px' }"
    ></div>
    <div
      class="ball bg-app-base-color"
      @mousedown="onBallMousedown"
      @mouseup="onGlobalMouseup"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { numberLimitRange, withEmptyValue } from "@/utils";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

interface Props {
  process: number; // 0 - 1
}

const emit = defineEmits(["skipTo", "update:process"]);

const props = defineProps<Props>();

const progressBarRef = ref<HTMLElement>();

watch(
  () => progressBarRef.value?.offsetWidth,
  (newVal) => {
    // console.log(newVal);
  }
);

const onProgressBarClick = (ev: MouseEvent) => {
  const offsetWidth = withEmptyValue<number>(
    progressBarRef.value?.offsetWidth,
    0
  );
  // emit("skipTo", Number((ev.x / offsetWidth).toFixed(4))); // 0 - 1
  const _p = ev.x / offsetWidth;
  emit("skipTo", _p);
  emit("update:process", _p);
};

const isMoving = ref(false);

interface Position {
  x: number;
  y: number;
}

const genPos = (x = 0, y = 0): Position => ({ x, y });

// 鼠标按下初始位置
const mousedownPos = ref<Position>(genPos());
const mousedownProcess = ref<number>(0);
// 偏移量 向量
const offsetPos = ref<Position>(genPos());
// 当前位置
const currentPos = ref<Position>(genPos());

watch(
  () => props.process,
  (newVal) => {
    currentPos.value.x =
      withEmptyValue<number>(progressBarRef.value?.offsetWidth, 0) * newVal;
  }
);

const onBallMousedown = (ev: MouseEvent) => {
  isMoving.value = true;
  mousedownProcess.value = props.process;
  mousedownPos.value.x = ev.x;
};

const onGlobalMouseup = () => {
  isMoving.value = false;
};

const mousemoveListener = (ev: MouseEvent) => {
  if (isMoving.value) {
    offsetPos.value.x = ev.x - mousedownPos.value.x;
    const _p =
      mousedownProcess.value +
      offsetPos.value.x /
        withEmptyValue<number>(progressBarRef.value?.offsetWidth, 1);

    emit("update:process", numberLimitRange(_p, [0, 1]));
  }
};

onMounted(() => {
  currentPos.value.x =
    withEmptyValue<number>(progressBarRef.value?.offsetWidth, 0) *
    props.process;
  window.addEventListener("mousemove", mousemoveListener);
  window.addEventListener("mouseup", onGlobalMouseup);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", mousemoveListener);
  window.removeEventListener("mouseup", onGlobalMouseup);
});

const resizeListener = (ev: UIEvent) => {
  currentPos.value.x =
    withEmptyValue<number>(progressBarRef.value?.offsetWidth, 0) *
    props.process;
};

onMounted(() => {
  window.addEventListener("resize", resizeListener);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeListener);
});
</script>

<style lang="css" scoped>
/* @import "@/styles/variable.less"; */
/* @import "@/styles/mixins.less"; */

.progress-bar {
  --ball-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: calc(var(--ball-size) + 2px);
  overflow: hidden;
}
.progress-bar:hover > .ball {
  visibility: visible;
}
.process-content {
  flex: 0 0 auto;
  height: 2px;
}
.ball {
  visibility: hidden;
  flex: 0 0 auto;
  width: var(--ball-size);
  height: var(--ball-size);
  border-radius: 50%;
  transform: translate(-50%, 0);
}
</style>
