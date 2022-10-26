export default () => {
  const browserWindowSize = {
    minWidth: 1120,
    height: 750,
    minHeight: 750,
  };

  return {
    main: {
      dev: {
        browserWindowSize,
        loadURL: "http://127.0.0.1:5173/",
      },
      prod: {
        browserWindowSize,
        loadURL: "output/dist/renderer/index.html", // 运行时注入
      },
    },
    renderer: {
      dev: {},
      prod: {},
    },
  };
};
