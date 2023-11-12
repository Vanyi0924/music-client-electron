/**
 * @description: 是否为最新数据库
 * @param {string} name
 * @param {number} version
 */

import { UniqueKeys } from "@/enums/UniqueKeys";
import { enhanceJSONParse } from ".";

export const APP_DB = {
  TABLES: {
    SONGLIST_TABLE: UniqueKeys.SONGLIST,
    SONGLIST_DETAIL_TABLE: UniqueKeys.SONGLIST_DETAIL,
  },
};

export async function isLatestDB(
  name: string,
  version?: number
): Promise<boolean> {
  const dbs = await window.indexedDB.databases();
  return !!dbs.find((db) => db.name === name && db.version === version);
}

/**
 * @description: 是否有旧数据
 */
async function hasOldData(name: string, version: number) {
  const db = await getDBInfoByName(name);
  if (db && db.version && db.version < version) return true;
  return false;
}

/**
 * @description: 根据名称获取数据库
 */
async function getDBInfoByName(name: string) {
  const dbs = await window.indexedDB.databases();
  return dbs.find((db) => db.name === name);
}

/**
 * @description: 初始化数据库: 打开数据库 并 插入表结构
 */
function initDB(
  dbName: string,
  version: number,
  options?: {
    onupgradeneeded: (db: IDBDatabase) => Promise<any>;
  }
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version);

    request.onupgradeneeded = (event: any) => {
      if (options?.onupgradeneeded) {
        options?.onupgradeneeded(event.target.result as IDBDatabase);
      }
    };

    request.onsuccess = (event: any) => {
      console.log("数据库已连接[onsuccess]", event);
      resolve(event.target.result as IDBDatabase);
    };

    request.onerror = (event) => {
      reject(event);
    };
  });
}

type DBAllData = {
  objectStoreName: string;
  data: any[];
};

function wrapperPromise(fn: any): Promise<any> {
  return new Promise((resolve) => {
    fn.onsuccess = (event: any) => {
      resolve(event);
    };
  });
}

/**
 * @description: 获取数据库所有数据
 */
async function getAllData(db: IDBDatabase): Promise<DBAllData[]> {
  const storeNames = Array.from(db.objectStoreNames);
  const dbTransaction = db.transaction(storeNames);
  const returnValue: DBAllData[] = [];

  for (const sn of storeNames) {
    const o: DBAllData = {
      objectStoreName: sn,
      data: [],
    };

    const event = await wrapperPromise(dbTransaction.objectStore(sn).getAll());
    o.data = event.target.result;
    returnValue.push(o);
  }

  return returnValue;
}

class AppIndexedDB {
  db: IDBDatabase | null;
  oldData: DBAllData[];
  keyPath: string;

  constructor(options?: { keyPath?: string }) {
    this.db = null;
    this.oldData = [];
    this.keyPath = options?.keyPath ?? "id";
  }

  // 载入历史数据
  loadHistoryData(objectStore: IDBObjectStore, uniqueKeys: UniqueKeys) {
    objectStore.transaction.oncomplete = () => {
      this.oldData.forEach((oldData) => {
        if (oldData.objectStoreName === uniqueKeys) {
          oldData.data.forEach((d) => {
            this.createRow(uniqueKeys, d);
          });
        }
      });

      this.emptyOldData();
    };
  }

  // 清空历史数据
  emptyOldData() {
    this.oldData.length = 0;
  }

  delAllTables() {
    // 删除所有表
    this.db &&
      Array.from(this.db.objectStoreNames).forEach((name) => {
        this.db?.deleteObjectStore(name);
      });
  }

  createOS(key: UniqueKeys) {
    const os = this.db?.createObjectStore(key, {
      keyPath: this.keyPath,
    });
    os && this.loadHistoryData(os, key);
  }

  async handleOldDb(dbName: string, version?: number) {
    const hasOldDB = await hasOldData(dbName, version || 0);
    // 检查  是否有旧数据
    //    是 保存数据 向下执行
    //        onupgradeneeded 插入新的表结构 -> 事务oncomplete 保存旧数据 -> success
    //    否 向下执行 success
    if (hasOldDB) {
      const dbInfo = await getDBInfoByName(dbName);
      if (dbInfo) {
        const db = await initDB(
          dbInfo.name as string,
          dbInfo.version as number
        );
        // 保存旧数据
        this.oldData = await getAllData(db);
        db.close();
      } else {
        // 无此情况 nothing todo...
      }
    } else {
      // 无旧数据 nothing todo...
    }
  }

  // 打开|创建数据库
  async openDB(dbName: string, version?: number) {
    await this.handleOldDb(dbName, version);

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, version);
      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result as IDBDatabase;

        this.delAllTables();

        // 构建表
        this.createOS(APP_DB.TABLES.SONGLIST_TABLE);
        this.createOS(APP_DB.TABLES.SONGLIST_DETAIL_TABLE);
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result as IDBDatabase;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  createRow<T = any>(tableName: string, data: T) {
    this.db
      ?.transaction(tableName, "readwrite")
      .objectStore(tableName)
      .put(data); // put 可新增 也可更新
  }

  deleteRow(tableName: string, key: IDBValidKey | IDBKeyRange) {
    return new Promise<boolean>((resolve) => {
      if (this.db) {
        const request = this.db
          .transaction(tableName, "readwrite")
          .objectStore(tableName)
          .delete(key);
        request.onsuccess = () => {
          resolve(true);
        };
      } else {
        resolve(false);
      }
    });
  }

  updateRow<T = any>(tableName: string, data: any) {
    return new Promise<T | null>((resolve) => {
      if (this.db) {
        const request = this.db
          .transaction(tableName, "readwrite")
          .objectStore(tableName)
          .put(data);
        request.onsuccess = () => {
          resolve(data);
        };
      } else {
        resolve(null);
      }
    });
  }

  async readRow<T = any>(tableName: string, key: IDBValidKey | IDBKeyRange) {
    return new Promise<T | null>((resolve) => {
      if (this.db) {
        const request = this.db
          .transaction(tableName, "readonly")
          .objectStore(tableName)
          .get(key);
        request.onsuccess = () => {
          resolve(enhanceJSONParse(request.result) || null);
        };
      } else {
        resolve(null);
      }
    });
  }

  readAllRows<T = any>(tableName: string) {
    return new Promise<T | null>((resolve) => {
      if (this.db) {
        const request = this.db
          .transaction(tableName, "readonly")
          .objectStore(tableName)
          .getAll();
        request.onsuccess = () => {
          resolve(request.result as T);
        };
      } else {
        resolve(null);
      }
    });
  }
}

export const appIndexedDB = new AppIndexedDB();
