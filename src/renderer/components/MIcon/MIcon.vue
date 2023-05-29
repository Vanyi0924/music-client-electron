<template>
  <div
    class="m-icon"
    :style="{
      width: compatNum(width),
      height: compatNum(height),
      color: color,
      opacity: opacity,
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  width?: string | number;
  height?: string | number;
  color?: string;
  opacity?: number;
}

const props = withDefaults(defineProps<Props>(), {});

const compatNum = (n: string | number | undefined) => {
  if (n === undefined) {
    if (props.width) {
      return typeof props.width === "number" ? `${props.width}px` : props.width;
    }
    return "20px";
  }
  return typeof n === "number" ? `${n}px` : n;
};
</script>

<!-- <style lang="less" scoped>
.m-icon {
  font-size: 0;
  :slotted(svg) {
    width: 100%;
    height: 100%;
  }
}
</style> -->
