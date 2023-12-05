import { ref, watch } from "vue";

export const useCountdown = (time = 60) => {
  const DEFAULT_TIME = time;
  const timeCount = ref(DEFAULT_TIME);
  const timer = ref<number>();
  const counting = ref(false);

  const start = () => {
    counting.value = true;
    timeCount.value--;
    timer.value = window.setInterval(() => {
      timeCount.value--;
      console.log(timeCount.value);
    }, 1000);
  };

  const reset = () => {
    window.clearInterval(timer.value);
    timeCount.value = DEFAULT_TIME;
    counting.value = false;
  };

  watch(timeCount, (newVal) => {
    if (!newVal) {
      reset();
    }
  });

  return { timeCount, start, reset, counting };
};
