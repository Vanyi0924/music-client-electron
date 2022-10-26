export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GLOBAL_ENV_PWD: string;
      GLOBAL_IS_PACKAGED: string; // '0' false '1' true
    }
  }
}
