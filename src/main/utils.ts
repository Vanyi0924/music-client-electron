import { resolve } from "path";

/**
 * @description 缓存目录 固定为_temp
 */
export const getTempPath = (): string => {
  const _temp = resolve(
    process.env.GLOBAL_ENV_PWD,
    process.env.GLOBAL_IS_PACKAGED === "1" ? "../_temp" : "./_temp"
  );
  return _temp;
};
