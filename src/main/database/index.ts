import { resolve } from "path";
import lodash from "lodash";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { getTempPath } from "../utils";
import fs from "fs-extra";
import { debugLogger } from "../logs";

/**
 * @description 模拟数据库表
 **/
const DB_TABLES: {
  foo: string | null;
  bar: number[];
} = {
  foo: "",
  bar: [],
};

export let localDB: low.LowdbSync<any>;

export default async () => {
  debugLogger.info("启动本地数据库");

  const file = resolve(getTempPath(), "db.json");
  !fs.existsSync(file) && fs.createFileSync(file);

  const adapter = new FileSync(file);
  const db = low(adapter);
  // db.read();
  const mixinData = lodash.assign(DB_TABLES, db.getState());
  db.defaults(mixinData).write();
  localDB = db;
};
