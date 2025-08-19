import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
import Taro from "@tarojs/taro";

import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");

    // 初始化云开发
    Taro.cloud.init({
      env: process.env.TARO_APP_CLOUD_ENV,
    });
    console.log("云托管已初始化");
    console.log("运行环境 :" + process.env.TARO_APP_ENV);
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
