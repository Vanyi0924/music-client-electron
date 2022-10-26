import workerpool from "workerpool";

workerpool.worker({
  say: () => {
    return "i am from worker"
  },
});
