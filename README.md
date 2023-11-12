# 律动音乐（客户端）

## 依赖安装

```js
npm i // pnpm i
```

## 运行

方式一：
在项目根目录下执行

```js
npm run dev // pnpm dev
```

方式二：
点击 vscode 左侧 `运行和调试` 按钮，再开启调试 或者使用 `F5` 快捷键

## 构建

```js
npm run build // pnpm build
```

## 问题

Q: Tailwinds + Ant design : Button color is white but has own color wnen I hover it
A: https://stackoverflow.com/questions/71715157/tailwinds-ant-design-button-color-is-white-but-has-own-color-wnen-i-hover-it
修改配置文件`tailwind.config.js`,

```js
corePlugins: {
  preflight: false,
},
```
