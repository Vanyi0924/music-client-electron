import { UniqueKeys } from "@/enums/UniqueKeys";
import { appIndexedDB } from "./indexed-db";

/**
 * @description 数据缓存
 */
type DataPool = Record<UniqueKeys, Map<string, any>>;

type KeyParams = {
  key: UniqueKeys;
  fn: any;
  params?: any[];
};
type Payload<T> = {
  data: T;
};

const stringify = JSON.stringify;

class AppCache {
  private dataPool: DataPool = {} as any;

  constructor() {}

  private getFirstLevelMap(keyParams: KeyParams) {
    if (!this.dataPool[keyParams.key]) {
      this.dataPool[keyParams.key] = new Map();
    }
    return this.dataPool[keyParams.key];
  }

  // 添加
  add<T>(keyParams: KeyParams, payload: Payload<T>) {
    const paramsKeyMap = this.getFirstLevelMap(keyParams);
    const k = stringify(keyParams.params);
    const v = payload;
    paramsKeyMap!.set(k, v);
    return {
      k,
      v,
    };
  }

  // 读取
  get<T>(keyParams: KeyParams): Payload<T> {
    const paramsKeyMap = this.getFirstLevelMap(keyParams);
    return paramsKeyMap?.get(stringify(keyParams.params));
  }

  // 是否存在
  has(keyParams: KeyParams) {
    const paramsKeyMap = this.getFirstLevelMap(keyParams);
    return paramsKeyMap?.has(stringify(keyParams.params));
  }
}

const appCache = new AppCache();

export const withCache = async <T = any>(args: KeyParams): Promise<T> => {
  console.log("appCache", appCache);

  args.params = args.params ?? [];

  if (appCache.has(args)) {
    return appCache.get<T>(args).data;
  } else {
    const result = await args.fn(...args.params);
    const row = appCache.add(args, {
      data: result,
    });

    console.log(row);

    return result;
  }
};
