import LoopListIcon from "@/assets/icons/vue/LoopList.vue";
import LoopRandomIcon from "@/assets/icons/vue/LoopRandom.vue";
import LoopSingleIcon from "@/assets/icons/vue/LoopSingle.vue";

const newLineRE = /\n/g;
// match [00:00:00] some words
const lyricTimeRE = /\[[0-9:\.]+\]/;

const perTime = /[0-9]{2,}/g;

export const withEmptyValue = <T>(v: any, empty: T): T => {
  return v ? v : empty;
};

// [00:00:00] -> number
const str2TimeNumber = (str?: string): number => {
  if (!str) return 0;
  const _a = str.match(perTime);
  const m = withEmptyValue<number>(_a?.[0], 0);
  const s = withEmptyValue<number>(_a?.[1], 0);
  const ms = withEmptyValue<number>(_a?.[2], 0);
  return m * 60 + s * 1 + ms / 1000;
};

export const lyricStr2PerLyric = (lyric?: string): PerLyric[] => {
  if (!lyric) return [];
  const returnValue: PerLyric[] = [];
  lyric.split(newLineRE).forEach((l, i) => {
    let t = str2TimeNumber(l.match(lyricTimeRE)?.[0]);
    if (i && !t) t = -1;
    returnValue.push({
      active: false,
      time: t,
      lineLyric: withEmptyValue(l.split(lyricTimeRE)[1], ""),
    });
  });

  return returnValue;
};

export const lyricStr2PerLyricV2 = (
  lyrics: { lyric: string; time: string }[]
): PerLyric[] => {
  if (!lyrics) return [];
  const returnValue: PerLyric[] = [];
  lyrics.forEach((l, i) => {
    let t = Number(l.time || 0);
    if (i && !t) t = -1;
    returnValue.push({
      active: false,
      time: t,
      lineLyric: l.lyric,
    });
  });

  return returnValue;
};

const defaultTime = "00";

// number 秒 -> 00:00:00
export const number2Time = (time: number): string => {
  const mm = withEmptyValue<string>(
    Math.trunc(time / 60).toString(),
    defaultTime
  ).padStart(2, "0");
  const ss = withEmptyValue<string>(
    Math.trunc(time % 60).toString(),
    defaultTime
  ).padStart(2, "0");
  return `${mm}:${ss}`;
};

/**
 * @description: 限制数字在一个区间内 []
 * @param {num} time
 */
export const numberLimitRange = (
  num: number,
  range: [number, number]
): number => {
  // Math.max(range[0] , num); // 左
  // Math.min(range[1] ,num); // 右
  if (num < range[0]) return range[0]; // 左
  else if (num > range[1]) return range[1]; // 右
  else return num; // self
};

/**
 * @description: 播放模式
 * loop 单曲循环
 * list 列表循环
 * random 随机循环
 */
export enum PlayModel {
  loop,
  list,
  random,
}

export const getPlayModel = (model: PlayModel) => {
  switch (model) {
    case PlayModel.list:
      return {
        label: "列表循环",
        icon: LoopListIcon,
      };
    case PlayModel.random:
      return {
        label: "随机播放",
        icon: LoopRandomIcon,
      };
    case PlayModel.loop:
      return {
        label: "单曲循环",
        icon: LoopSingleIcon,
      };
  }
};

export enum SwitchSongDirection {
  prev = -1,
  next = +1,
}

/**
 * @description: 上|下一曲
 */
export const nextSongIndex = (
  model: PlayModel,
  curIndex: number,
  total: number,
  optDirection?: SwitchSongDirection
): number => {
  if (curIndex === -1) {
    // total 0
    return curIndex;
  }

  switch (model) {
    case PlayModel.random:
      return Math.trunc(Math.random() * total);
    default:
      if (!optDirection) {
        if (model === PlayModel.loop) {
          return curIndex;
        } else {
          optDirection = SwitchSongDirection.next;
        }
      }

      if (!curIndex && SwitchSongDirection.prev === optDirection) {
        // 第一首&&上一曲
        return total - 1;
      }

      return (curIndex + optDirection) % total;
  }
};

/**
 * @description: json parse
 * @param {any} data
 */
export const enhanceJSONParse = <T = any>(data: any): T | null => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

/**
 * @description: 小于补0
 */
export const paddingStrStart = <T = any>(
  str: string | number,
  maxLen = 2,
  fillStr = "0"
): string => {
  return str.toString().padStart(maxLen, fillStr);
};

/**
 * @description: isMobile ?
 */
export const isMobile = () => /Mobi|Android|iPhone/i.test(navigator.userAgent);
