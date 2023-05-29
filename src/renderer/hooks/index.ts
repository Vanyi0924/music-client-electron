import { onMounted, onUnmounted, Ref, watch } from "vue";

/**
 * @description: 是点击外部
 */
export const useClickIsOutside = (cb: (val: boolean) => void) => {
  let _el: any;
  const listener = (evt: MouseEvent) => {
    cb(!evt.composedPath().includes(_el));
  };

  onMounted(() => {
    window.addEventListener("click", listener);
  });

  onUnmounted(() => {
    window.removeEventListener("click", listener);
  });

  return (el?: HTMLElement) => {
    _el = el;
  };
};
