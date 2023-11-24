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

const isDev = process.env.NODE_ENV === "development";

export default (): ElectronVueConfig => {
  console.log(process.env.NODE_ENV);

  const browserWindowSize = {
    minWidth: 1000,
    minHeight: 670,
  };

  return {
    main: {
      browserWindowSize,
      loadURL: "http://127.0.0.1:9024/",
    },
    renderer: {
      baseURL: isDev
        ? "http://192.168.2.26:10926/api"
        : "https://api.vanyi.top/api",
    },
  };
};
