type ElectronVueConfig = {
  main: {
    browserWindowSize: {
      minWidth: number;
      // height: number;
      minHeight: number;
    };
    loadURL: string;
  };
  renderer: {
    baseURL: string;
  };
};

export default (): ElectronVueConfig => {
  const browserWindowSize = {
    minWidth: 1000,
    // height: 670,
    minHeight: 670,
  };

  return {
    main: {
      browserWindowSize,
      loadURL: "http://127.0.0.1:9024/",
    },
    renderer: {
      baseURL: "http://localhost:19090/api",
    },
    /*  prod: {
      main: {
        browserWindowSize,
        loadURL: "output/dist/renderer/index.html", // 运行时注入
      },
      renderer: {
        baseURL: "",
      },
    }, */
  };
};
