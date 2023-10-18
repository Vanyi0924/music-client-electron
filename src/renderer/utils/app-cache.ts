/**
 * @description 数据缓存
 *
 */
type DataPool = Map<any, Map<string, any>>;

type KeyParams = [fn: any, params: any];
type Payload<T> = {
  data: T;
};

class AppCache {
  private dataPool: DataPool = new Map([]);

  constructor() {}

  private getFirstLevelMap(key: KeyParams) {
    if (!this.dataPool.has(key[0])) {
      this.dataPool.set(key[0], new Map());
    }

    return this.dataPool.get(key[0]);
  }

  // 添加
  add<T>(key: KeyParams, payload: Payload<T>) {
    const paramsKeyMap = this.getFirstLevelMap(key);
    paramsKeyMap!.set(JSON.stringify(key[1]), payload);
  }

  // 读取
  get<T>(key: KeyParams): Payload<T> {
    const paramsKeyMap = this.getFirstLevelMap(key);
    return paramsKeyMap?.get(JSON.stringify(key[1]));
  }

  // 是否存在
  has(key: KeyParams) {
    const paramsKeyMap = this.getFirstLevelMap(key);
    return paramsKeyMap?.has(JSON.stringify(key[1]));
  }
}

const appCache = new AppCache();

// 函数 + 参数stringify 组成唯一 key
// 支持自定义配置
export const withCache = async <T = any>(
  fn: any,
  ...params: any[]
): Promise<T> => {
  const keyParams: KeyParams = [fn, params];

  if (appCache.has(keyParams)) {
    return appCache.get<T>(keyParams).data;
  } else {
    const result = await fn(...params);
    appCache.add(keyParams, {
      data: result,
    });
    return result;
  }
};
