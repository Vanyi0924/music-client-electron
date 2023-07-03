export default () => {
  const browserWindowSize = {
    minWidth: 1000,
    height: 670,
    minHeight: 670,
  };

  return {
    main: {
      dev: {
        browserWindowSize,
        loadURL: "http://127.0.0.1:9024/",
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
