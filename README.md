# electron-vue3 项目模板（electron-vue3-template）

<img src="src/renderer/assets/imgs/electron.svg" width = "100" />
<img src="src/renderer/assets/imgs/vue.svg" width = "100" />
<img src="src/renderer/assets/imgs/logo-with-shadow.png" width = "120" />
<img src="src/renderer/assets/imgs/pinia.svg" width = "85" />

## 运行
- 在项目根目录下执行
```js
pnpm i
npm run dev // pnpm dev
```
- 点击 vscode左侧 `运行和调试` 按钮，再开启调试 或者使用 `F5` 快捷键

## 构建

```js
npm run build // pnpm build
```

- 应用打包配置
  `package.json` 中 build 字段，参考[electron-builder](https://www.electron.build/)

## 构建脚本

参考 `scripts/*` 中脚本文件

## 技术栈

- pnpm
- vue3
- vite
- pinia
- vue-router
- ts
- electron
- winston
- workerpool

## 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
